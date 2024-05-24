import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper';
import { Question } from '@/domain/forum/enterprise/entities/question';




@Injectable()
export class PrismaQuestionsRepository implements QuestionRepository{
  constructor(private prisma: PrismaService) {}

  create(question: Question): Promise<void> {

  }

  delete(question: Question): Promise<void> {
    return Promise.resolve(undefined);
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where:{
        id,
      }
    })
    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  findBySlug(slug: string): Promise<Question | null> {
    return Promise.resolve(undefined);
  }

  findManyRecent(params: PaginationParams): Promise<Question[]> {
    return Promise.resolve([]);
  }

  save(question: Question): Promise<void> {
    return Promise.resolve(undefined);
  }

}