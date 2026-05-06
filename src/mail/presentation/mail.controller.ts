import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard.js';
import {
  CurrentUser,
  type JwtPayload,
} from '../../common/decorator/current-user.decorator.js';
import { MailService } from '../application/mail.service.js';
import { SubmitReplyRequestDto } from '../application/dto/submit-reply.request.dto.js';
import { ReplyAllQueryDto } from '../application/dto/reply-all.query.dto.js';

@Controller()
@UseGuards(JwtAuthGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('mail/today')
  getTodayQuestion(@CurrentUser() user: JwtPayload) {
    return this.mailService.getTodayQuestion(user.sub);
  }

  @Post('mail/today/reply')
  @HttpCode(HttpStatus.CREATED)
  submitReply(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SubmitReplyRequestDto,
  ) {
    return this.mailService.submitReply(user.sub, dto);
  }

  @Get('reply-all')
  getAllReplies(
    @CurrentUser() user: JwtPayload,
    @Query() query: ReplyAllQueryDto,
  ) {
    return this.mailService.getAllReplies(user.sub, query);
  }
}
