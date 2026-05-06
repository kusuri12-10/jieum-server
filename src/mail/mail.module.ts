import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyQuestionOrmEntity } from './infrastructure/orm/daily-question.orm-entity.js';
import { ReplyOrmEntity } from './infrastructure/orm/reply.orm-entity.js';
import { DailyQuestionRepositoryImpl } from './infrastructure/repository/daily-question.repository.impl.js';
import { ReplyRepositoryImpl } from './infrastructure/repository/reply.repository.impl.js';
import { MailService } from './application/mail.service.js';
import { MailController } from './presentation/mail.controller.js';
import { DAILY_QUESTION_REPOSITORY } from './domain/repository/daily-question.repository.js';
import { REPLY_REPOSITORY } from './domain/repository/reply.repository.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyQuestionOrmEntity, ReplyOrmEntity]),
    AuthModule,
  ],
  controllers: [MailController],
  providers: [
    MailService,
    {
      provide: DAILY_QUESTION_REPOSITORY,
      useClass: DailyQuestionRepositoryImpl,
    },
    { provide: REPLY_REPOSITORY, useClass: ReplyRepositoryImpl },
  ],
  exports: [DAILY_QUESTION_REPOSITORY, REPLY_REPOSITORY],
})
export class MailModule {}
