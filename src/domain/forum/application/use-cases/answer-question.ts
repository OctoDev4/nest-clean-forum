import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Either, right } from '@/core/either';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list';
import { Injectable } from '@nestjs/common';

interface AswerQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  attachmentsIds: string[];
  content: string;
}
type AswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;
@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AswerQuestionUseCaseRequest): Promise<AswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentsId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentsId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answerRepository.create(answer);

    return right({
      answer,
    });
  }
}
