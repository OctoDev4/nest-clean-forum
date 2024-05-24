import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { undefined } from 'zod';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';



@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository{
  deleteManyByAnswerId(answerId: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return Promise.resolve([]);
  }

}