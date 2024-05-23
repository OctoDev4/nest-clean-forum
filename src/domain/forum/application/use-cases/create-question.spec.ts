import { beforeEach, describe, expect, it, test } from 'vitest';

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'teste',
      content: 'teste',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.items[0].id).toEqual(
      result.value?.question.id,
    );

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ]);
  });
});
