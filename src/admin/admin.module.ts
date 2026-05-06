import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MailModule } from '../mail/mail.module.js';
import { ShopModule } from '../shop/shop.module.js';
import { ThemeModule } from '../theme/theme.module.js';
import { AdminQuestionService } from './question/application/admin-question.service.js';
import { AdminQuestionController } from './question/presentation/admin-question.controller.js';
import { AdminUserService } from './user/application/admin-user.service.js';
import { AdminUserController } from './user/presentation/admin-user.controller.js';
import { AdminProductService } from './product/application/admin-product.service.js';
import { AdminProductController } from './product/presentation/admin-product.controller.js';
import { AdminThemeItemService } from './theme/application/admin-theme-item.service.js';
import { AdminThemeItemController } from './theme/presentation/admin-theme-item.controller.js';

@Module({
  imports: [AuthModule, MailModule, ShopModule, ThemeModule],
  controllers: [
    AdminQuestionController,
    AdminUserController,
    AdminProductController,
    AdminThemeItemController,
  ],
  providers: [
    AdminQuestionService,
    AdminUserService,
    AdminProductService,
    AdminThemeItemService,
  ],
})
export class AdminModule {}
