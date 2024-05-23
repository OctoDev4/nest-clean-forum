import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository';

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    this.items = questionAttachments;
  }
}
