import { Module } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionsRepository } from '@/infra/database/prisma/repositories/prisma-questions-repository';
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository';
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository';
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/prisma-student-repository';





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
  ],
  exports: [PrismaService, QuestionRepository, StudentRepository],
})
export class DatabaseModule {}
