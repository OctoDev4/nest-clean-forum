import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class AnswerCommentsRepository {
   abstract findById(id: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;
  abstract create(answerComment: AnswerComment): Promise<void>;
 abstract delete(AnswerComment: AnswerComment): Promise<void>;
}
