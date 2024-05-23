import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Optional } from '@/core/types/optional';
import {
  Comment,
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment';

import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event';

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId;
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    const isQuestionComment = !id;

    if (isQuestionComment) {
      questionComment.addDomainEvent(
        new QuestionCommentCreatedEvent(questionComment),
      );
    }
    return questionComment;
  }
}
