import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service.js';
import { SignupRequestDto } from '../application/dto/signup.request.dto.js';
import { LoginRequestDto } from '../application/dto/login.request.dto.js';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard.js';
import { CurrentUser, type JwtPayload } from '../../common/decorator/current-user.decorator.js';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignupRequestDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser() user: JwtPayload): Promise<void> {
    return this.authService.logout(user.sub, user.iat);
  }

  @Delete('withdrawal')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  withdraw(@CurrentUser() user: JwtPayload): Promise<void> {
    return this.authService.withdraw(user.sub);
  }
}
