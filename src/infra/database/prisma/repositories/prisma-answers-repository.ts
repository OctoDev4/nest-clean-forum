import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';

@Injectable()
export class PrismaAnswersRepository implements AnswerRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.create({
      data,
    });

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      return null;
    }
    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answer = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answer.map(PrismaAnswerMapper.toDomain)
  }

 async save(answer: Answer): Promise<void> {

    const data = PrismaAnswerMapper.toPrisma(answer)

   await Promise.all([
      await this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.answerAttachmentRepository.createMany(
        answer.attachments.getNewItems()
      ),
      this.answerAttachmentRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ])


   DomainEvents.dispatchEventsForAggregate(answer.id)


  }
}
