import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { Injectable } from '@nestjs/common';




@Injectable()
export class PrismaAnswersRepository implements AnswerRepository{
  create(answer: Answer): Promise<void> {
    return Promise.resolve(undefined);
  }

  delete(answer: Answer): Promise<void> {
    return Promise.resolve(undefined);
  }

  findById(id: string): Promise<Answer | null> {
    return Promise.resolve(undefined);
  }

  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
    return Promise.resolve([]);
  }

  save(anw: Answer): Promise<void> {
    return Promise.resolve(undefined);
  }

}