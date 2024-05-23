import { DomainEvent } from '@/core/events/domain-event';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  public answerComment: AnswerComment;

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.answerComment.id;
  }
}
