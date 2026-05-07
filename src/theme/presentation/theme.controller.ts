import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard.js';
import {
  CurrentUser,
  type JwtPayload,
} from '../../common/decorator/current-user.decorator.js';
import { ThemeService } from '../application/theme.service.js';

@Controller('theme')
@UseGuards(JwtAuthGuard)
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get('bottle')
  getBottleThemes(@CurrentUser() user: JwtPayload) {
    return this.themeService.getThemes(user.sub, 'BOTTLE');
  }

  @Get('mailbox')
  getMailboxThemes(@CurrentUser() user: JwtPayload) {
    return this.themeService.getThemes(user.sub, 'MAILBOX');
  }

  @Get('mail')
  getMailThemes(@CurrentUser() user: JwtPayload) {
    return this.themeService.getThemes(user.sub, 'MAIL');
  }

  @Patch('bottle/:id')
  @HttpCode(HttpStatus.OK)
  changeBottleTheme(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.themeService.changeTheme(user.sub, 'BOTTLE', id);
  }

  @Patch('mailbox/:id')
  @HttpCode(HttpStatus.OK)
  changeMailboxTheme(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.themeService.changeTheme(user.sub, 'MAILBOX', id);
  }

  @Patch('mail/:id')
  @HttpCode(HttpStatus.OK)
  changeMailTheme(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.themeService.changeTheme(user.sub, 'MAIL', id);
  }
}
