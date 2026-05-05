import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreakOrmEntity } from './infrastructure/orm/streak.orm-entity.js';
import { StreakRepositoryImpl } from './infrastructure/repository/streak.repository.impl.js';
import { MainScreenService } from './application/main-screen.service.js';
import { MainScreenController } from './presentation/main-screen.controller.js';
import { STREAK_REPOSITORY } from './domain/repository/streak.repository.js';
import { AuthModule } from '../auth/auth.module.js';
import { ThemeModule } from '../theme/theme.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([StreakOrmEntity]),
    AuthModule,
    ThemeModule,
  ],
  controllers: [MainScreenController],
  providers: [
    MainScreenService,
    { provide: STREAK_REPOSITORY, useClass: StreakRepositoryImpl },
  ],
})
export class MainScreenModule {}
