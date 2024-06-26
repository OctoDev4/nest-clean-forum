import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Upload attachment (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    studentFactory = moduleFixture.get<StudentFactory>(StudentFactory);
    jwt = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });

    // Verificar se o console.log está funcionando
    console.log(response);
  });
});
