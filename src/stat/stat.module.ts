import { Module } from '@nestjs/common';
import { StatService } from './application/stat.service.js';
import { StatController } from './presentation/stat.controller.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [MailModule],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
