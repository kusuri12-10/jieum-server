import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/orm/user.orm-entity.js';
import { UserRepositoryImpl } from './infrastructure/repository/user.repository.impl.js';
import { UserService } from './application/user.service.js';
import { UserController } from './presentation/user.controller.js';
import { USER_REPOSITORY } from './domain/repository/user.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
