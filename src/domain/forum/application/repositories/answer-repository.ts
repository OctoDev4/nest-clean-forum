import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { PaginationParams } from '@/core/repositories/pagination-params';

export abstract class AnswerRepository {
  abstract findById(id: string): Promise<Answer | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  abstract create(answer: Answer): Promise<void>;
   abstract save(anw: Answer): Promise<void>;
 abstract delete(answer: Answer): Promise<void>;
}
