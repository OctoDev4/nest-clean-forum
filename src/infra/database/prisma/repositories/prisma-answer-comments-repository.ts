import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { Injectable } from '@nestjs/common';




@Injectable()

export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository{
  create(answerComment: AnswerComment): Promise<void> {
    return Promise.resolve(undefined);
  }

  delete(AnswerComment: AnswerComment): Promise<void> {
    return Promise.resolve(undefined);
  }

  findById(id: string): Promise<AnswerComment | null> {
    return Promise.resolve(undefined);
  }

  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
    return Promise.resolve([]);
  }

}