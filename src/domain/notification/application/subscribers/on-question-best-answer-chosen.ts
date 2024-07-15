import { EventHandler } from '@/core/events/event-handler';
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event';
import { Injectable } from '@nestjs/common';



@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswerRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `sua reposta foi escolhida ${question.title.substring(0, 40).concat('...')}`,
        content: `a resposta que voce enviou em "${question.title.substring(0, 20)} foi escolhida pelo autor"`,
      });
    }
  }
}
