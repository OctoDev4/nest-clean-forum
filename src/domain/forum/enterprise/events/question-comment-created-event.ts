import { DomainEvent } from '@/core/events/domain-event';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class QuestionCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public questionComment: QuestionComment;

  constructor(questionComment: QuestionComment) {
    this.questionComment = questionComment;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.questionComment.id;
  }
}
