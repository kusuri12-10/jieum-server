import {
  Body,
  Controller,
  Get,
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
import { MainScreenService } from '../application/main-screen.service.js';
import { UpdateStreakGoalRequestDto } from '../application/dto/update-streak-goal.request.dto.js';

@Controller()
@UseGuards(JwtAuthGuard)
export class MainScreenController {
  constructor(private readonly mainScreenService: MainScreenService) {}

  @Get('main')
  getMainScreen(@CurrentUser() user: JwtPayload) {
    return this.mainScreenService.getMainScreen(user.sub);
  }

  @Patch('streak')
  @HttpCode(HttpStatus.OK)
  updateStreakGoal(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateStreakGoalRequestDto,
  ) {
    return this.mainScreenService.updateStreakGoal(user.sub, dto);
  }
}
