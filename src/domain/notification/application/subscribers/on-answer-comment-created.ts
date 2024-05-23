import { EventHandler } from '@/core/events/event-handler';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';

import { DomainEvents } from '@/core/events/domain-events';
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event';

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answerRepository: AnswerRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    );
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(
      answerComment.answerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `nova resposta em ${answer.content.substring(0, 40).concat('...')}`,
        content: answer.excerpt,
      });
    }
  }
}
