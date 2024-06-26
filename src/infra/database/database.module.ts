import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository';
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/prisma-student-repository';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository';
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { PrismaAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-attachments-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswerRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionRepository,
    StudentRepository,
    QuestionCommentRepository,
    QuestionAttachmentRepository,
    AnswerRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
    AttachmentsRepository,
  ],
})
export class DatabaseModule {}