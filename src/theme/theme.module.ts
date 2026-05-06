import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeItemOrmEntity } from './infrastructure/orm/theme-item.orm-entity.js';
import { UserThemeOrmEntity } from './infrastructure/orm/user-theme.orm-entity.js';
import { ThemeItemRepositoryImpl } from './infrastructure/repository/theme-item.repository.impl.js';
import { UserThemeRepositoryImpl } from './infrastructure/repository/user-theme.repository.impl.js';
import { ThemeService } from './application/theme.service.js';
import { ThemeController } from './presentation/theme.controller.js';
import { THEME_ITEM_REPOSITORY } from './domain/repository/theme-item.repository.js';
import { USER_THEME_REPOSITORY } from './domain/repository/user-theme.repository.js';
import { ShopModule } from '../shop/shop.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThemeItemOrmEntity, UserThemeOrmEntity]),
    ShopModule,
  ],
  controllers: [ThemeController],
  providers: [
    ThemeService,
    { provide: THEME_ITEM_REPOSITORY, useClass: ThemeItemRepositoryImpl },
    { provide: USER_THEME_REPOSITORY, useClass: UserThemeRepositoryImpl },
  ],
  exports: [THEME_ITEM_REPOSITORY, USER_THEME_REPOSITORY],
})
export class ThemeModule {}
