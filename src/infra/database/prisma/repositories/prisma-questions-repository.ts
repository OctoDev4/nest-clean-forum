import { PaginationParams } from '@/core/repositories/pagination-params'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { PrismaQuestionDetailsMapper } from '@/infra/database/prisma/mappers/prisma-question-details-mapper';
import { DomainEvents } from '@/core/events/domain-events';
import { CacheRepository } from '@/infra/cache/cache-repository';


@Injectable()
export class PrismaQuestionsRepository implements QuestionRepository {
  constructor(
      private prisma: PrismaService,
      private cacheRepository: CacheRepository,
      private questionAttachmentRepository: QuestionAttachmentRepository
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {

    const cacheHit = await this.cacheRepository.get(`question:${slug}:details`)

    if (cacheHit){
      const cacheData = JSON.parse(cacheHit)

      return cacheData
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    const questionDetails = PrismaQuestionMapper.toDomain(question)

    await this.cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
    );

    return questionDetails;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })
    await this.questionAttachmentRepository.createMany(
        question.attachments.getItems()
    )

    DomainEvents.dispatchEventsForAggregate(question.id)

  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)


    await Promise.all([

      await this.prisma.question.update({
        where: {
          id: question.id.toString(),
        },
        data,
      }),
        this.questionAttachmentRepository.createMany(
            question.attachments.getNewItems()
        ),
        this.questionAttachmentRepository.deleteMany(
            question.attachments.getRemovedItems()
        ),


      this.cacheRepository.delete(`question:${data.slug}:details`)
    ])


    DomainEvents.dispatchEventsForAggregate(question.id)





  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      }
    })

    if (!question) {
      return null
    }

    return PrismaQuestionDetailsMapper.toDomain(question);
  }
}