import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DomainEvents } from '@/core/events/domain-events';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = [];

  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }
  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);

    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );
    this.items.splice(itemIndex, 1);
  }
}
