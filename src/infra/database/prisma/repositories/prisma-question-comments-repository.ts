import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import { Injectable } from '@nestjs/common';



@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentRepository{
  create(questionComment: QuestionComment): Promise<void> {
    return Promise.resolve(undefined);
  }

  delete(questionComment: QuestionComment): Promise<void> {
    return Promise.resolve(undefined);
  }

  findById(id: string): Promise<QuestionComment | null> {
    return Promise.resolve(undefined);
  }

  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
    return Promise.resolve([]);
  }

}