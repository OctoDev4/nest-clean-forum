import { PaginationParams } from '@/core/repositories/pagination-params'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import {QuestionAttachmentRepository} from "@/domain/forum/application/repositories/question-attachments-repository";
import {promise} from "zod";

@Injectable()
export class PrismaQuestionsRepository implements QuestionRepository {
  constructor(
      private prisma: PrismaService,
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
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
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
        )
    ])





  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    })
  }
}