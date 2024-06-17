import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;
@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentQuestion =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(currentQuestion);

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;

    question.attachments = questionAttachmentList;

    await this.questionRepository.save(question);

    return right({});
  }
}
