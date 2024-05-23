import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created';

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
import { MakeQuestion } from '../../../../../test/factories/make-question';

import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository';
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentAttachmentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Question Comment created', () => {
  beforeEach(() => {
    inMemoryQuestionCommentAttachmentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });

  it('should  send a notification when an answer is created', async () => {
    const question = MakeQuestion();
    const questionComment = makeQuestionComment({ questionId: question.id });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryQuestionCommentAttachmentsRepository.create(questionComment);

    waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
