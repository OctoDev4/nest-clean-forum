
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import {undefined} from "zod";

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    })
  }



  createMany(attachments: QuestionAttachment[]): Promise<void> {
    return Promise.resolve(undefined);
  }

  deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    return Promise.resolve(undefined);
  }
}