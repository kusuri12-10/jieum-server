import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard.js';
import {
  CurrentUser,
  type JwtPayload,
} from '../../common/decorator/current-user.decorator.js';
import { UserService } from '../application/user.service.js';
import { UpdateNicknameRequestDto } from '../application/dto/update-nickname.request.dto.js';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('nickname')
  updateNickname(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateNicknameRequestDto,
  ) {
    return this.userService.updateNickname(user.sub, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  withdraw(@CurrentUser() user: JwtPayload): Promise<void> {
    return this.userService.withdraw(user.sub);
  }
}
