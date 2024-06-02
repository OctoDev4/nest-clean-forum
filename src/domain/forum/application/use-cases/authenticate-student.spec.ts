import { RegisterStudentUseCase } from './register-student';

import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryStudentRepository } from '../../../../../test/repositories/in-memory-student-repository';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter';
import { makeStudent } from '../../../../../test/factories/make-student';
import { expect } from 'vitest';

let inMemoryStudentsRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it('should be able to authenticate a student ', async () => {



    const student = makeStudent({
      email: 'joemail@example.com',
      password: await fakeHasher.hash('123456'),
    })


    inMemoryStudentsRepository.items.push(student)


    const result = await sut.execute({
      email: 'joemail@example.com',
      password: '123456',
    })


    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  });


});