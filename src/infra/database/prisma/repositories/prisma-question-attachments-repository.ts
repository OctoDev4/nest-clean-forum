import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { undefined } from 'zod';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';


@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentRepository{
  deleteManyByQuestionId(questionId: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    return Promise.resolve([]);
  }

}