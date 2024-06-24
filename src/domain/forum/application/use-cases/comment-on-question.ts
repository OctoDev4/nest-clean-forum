import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';

interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;
@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private QuestionsRepository: QuestionRepository,
    private questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.QuestionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content: content,
    });

    await this.questionCommentRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
