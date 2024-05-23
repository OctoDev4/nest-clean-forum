import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created';

import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';

import { waitFor } from 'test/utils/wait-for';
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments';
import { MockInstance } from 'vitest';
import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositories/in-memory-answer-comments-repository';
import { OnAnswerCommentCreated } from '@/domain/notification/application/subscribers/on-answer-comment-created';
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment';
import { makeAnswer } from '../../../../../test/factories/make-answers';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    new OnAnswerCommentCreated(
      inMemoryAnswerRepository,
      sendNotificationUseCase,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
  });

  it('should  send a notification when an answer is created', async () => {
    const answer = makeAnswer({ questionId: new UniqueEntityId('questionId') });
    const answerComment = makeAnswerComment({ answerId: answer.id });

    await inMemoryAnswerRepository.create(answer);

    await inMemoryAnswerCommentRepository.create(answerComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
