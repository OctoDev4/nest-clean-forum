import { Module } from '@nestjs/common';

import { PrismaService } from '@/infra/prisma/prisma.service';
import { CreateAccountController } from '@/infra/http/controllers/create-account.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from '@/infra/auth/auth.module';
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller';
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller';
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recents-questions.controller';
import { HttpModule } from '@/infra/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule
  ],
  
})
export class AppModule {}
