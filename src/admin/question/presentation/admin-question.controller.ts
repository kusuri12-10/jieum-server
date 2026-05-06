import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../../common/guard/admin.guard.js';
import { AdminQuestionService } from '../application/admin-question.service.js';
import { CreateQuestionRequestDto } from '../application/dto/create-question.request.dto.js';
import { PaginationQueryDto } from '../../shared/dto/pagination.query.dto.js';

@Controller('admin/questions')
@UseGuards(AdminGuard)
export class AdminQuestionController {
  constructor(private readonly adminQuestionService: AdminQuestionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createQuestion(@Body() dto: CreateQuestionRequestDto) {
    return this.adminQuestionService.createQuestion(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.adminQuestionService.deleteQuestion(id);
  }

  @Get(':id/replies')
  getQuestionReplies(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.adminQuestionService.getQuestionReplies(id, query);
  }
}
