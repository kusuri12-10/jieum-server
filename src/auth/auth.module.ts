import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/orm/user.orm-entity.js';
import { UserRepositoryImpl } from './infrastructure/repository/user.repository.impl.js';
import { JwtStrategy } from './infrastructure/jwt.strategy.js';
import { AuthService } from './application/auth.service.js';
import { AuthController } from './presentation/auth.controller.js';
import { USER_REPOSITORY } from './domain/repository/user.repository.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: USER_REPOSITORY, useClass: UserRepositoryImpl },
  ],
  exports: [USER_REPOSITORY],
})
export class AuthModule {}
