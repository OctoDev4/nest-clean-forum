
import { Injectable } from '@nestjs/common'
import {Either, left, right} from "@/core/either";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import {QuestionComment} from "@/domain/forum/enterprise/entities/question-comment";
import {QuestionRepository} from "@/domain/forum/application/repositories/question-repository";
import {QuestionCommentRepository} from "@/domain/forum/application/repositories/question-comment-repository";
import {UniqueEntityId} from "@/core/entities/unique-entity-id";

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
    ResourceNotFoundError,
    {
      questionComment: QuestionComment
    }
>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
      private questionsRepository: QuestionRepository,
      private questionCommentsRepository: QuestionCommentRepository,
  ) {}

  async execute({
                  authorId,
                  questionId,
                  content,
                }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}