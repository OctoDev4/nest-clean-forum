import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { PaginationParams } from '@/core/repositories/pagination-params';

export interface AnswerRepository {
  findById(id: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  create(answer: Answer): Promise<void>;
  save(anw: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
}
