import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MailModule } from '../mail/mail.module.js';
import { ShopModule } from '../shop/shop.module.js';
import { ThemeModule } from '../theme/theme.module.js';
import { AdminService } from './application/admin.service.js';
import { AdminController } from './presentation/admin.controller.js';

@Module({
  imports: [AuthModule, MailModule, ShopModule, ThemeModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
