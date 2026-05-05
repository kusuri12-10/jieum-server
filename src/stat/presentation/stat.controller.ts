import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard.js';
import { CurrentUser, type JwtPayload } from '../../common/decorator/current-user.decorator.js';
import { StatService } from '../application/stat.service.js';

@Controller('stat')
@UseGuards(JwtAuthGuard)
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get()
  getStat(@CurrentUser() user: JwtPayload) {
    return this.statService.getStat(user.sub);
  }
}
