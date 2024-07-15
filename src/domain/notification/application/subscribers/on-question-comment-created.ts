import { EventHandler } from '@/core/events/event-handler';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';

import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { DomainEvents } from '@/core/events/domain-events';
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event';
import { Injectable } from '@nestjs/common';


@Injectable()
export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    );
  }

  private async sendNewQuestionCommentNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionRepository.findById(
      questionComment.questionId.toString(),
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `nova resposta em ${question.title.substring(0, 40).concat('...')}`,
        content: question.excerpt,
      });
    }
  }
}
