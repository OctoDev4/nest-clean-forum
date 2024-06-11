import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error';
import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;


@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}
