import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Either, right } from '@/core/either';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list';
import { Injectable } from '@nestjs/common';

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question;
  }
>;
@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    });

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });
    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.questionRepository.create(question);

    return right({
      question,
    });
  }
}
