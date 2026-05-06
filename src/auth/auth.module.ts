import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module.js';
import { JwtStrategy } from './infrastructure/jwt.strategy.js';
import { AuthService } from './application/auth.service.js';
import { AuthController } from './presentation/auth.controller.js';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [UserModule],
})
export class AuthModule {}
