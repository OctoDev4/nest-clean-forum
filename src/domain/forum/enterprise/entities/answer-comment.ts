import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import {
  Comment,
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment';
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event';
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event';

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId;
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    const isAnswerComment = !id;

    if (isAnswerComment) {
      answerComment.addDomainEvent(
        new AnswerCommentCreatedEvent(answerComment),
      );
    }

    return answerComment;
  }
}
