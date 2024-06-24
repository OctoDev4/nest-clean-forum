import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;
@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private AnswersRepository: AnswerRepository,
    private answerCommentRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.AnswersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content: content,
    });

    await this.answerCommentRepository.create(answerComment);

    return right({
      answerComment,
    });
  }
}
