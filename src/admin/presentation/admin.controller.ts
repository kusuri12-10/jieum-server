import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../common/guard/admin.guard.js';
import { AdminService } from '../application/admin.service.js';
import { CreateQuestionRequestDto } from '../application/dto/create-question.request.dto.js';
import { PaginationQueryDto } from '../application/dto/pagination.query.dto.js';
import { CreateProductRequestDto } from '../application/dto/create-product.request.dto.js';
import { UpdateProductRequestDto } from '../application/dto/update-product.request.dto.js';
import { BulkDeleteRequestDto } from '../application/dto/bulk-delete.request.dto.js';
import { CreateThemeItemRequestDto } from '../application/dto/create-theme-item.request.dto.js';
import { UpdateThemeItemRequestDto } from '../application/dto/update-theme-item.request.dto.js';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── 오늘의 질문 ───────────────────────────────────────────────────

  @Post('questions')
  @HttpCode(HttpStatus.CREATED)
  createQuestion(@Body() dto: CreateQuestionRequestDto) {
    return this.adminService.createQuestion(dto);
  }

  @Delete('questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteQuestion(id);
  }

  @Get('questions/:id/replies')
  getQuestionReplies(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.adminService.getQuestionReplies(id, query);
  }

  // ─── 유저 ──────────────────────────────────────────────────────────

  @Get('users/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUser(id);
  }

  // ─── 상품 ──────────────────────────────────────────────────────────

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() dto: CreateProductRequestDto) {
    return this.adminService.createProduct(dto);
  }

  @Delete('products')
  @HttpCode(HttpStatus.NO_CONTENT)
  bulkDeleteProducts(@Body() dto: BulkDeleteRequestDto) {
    return this.adminService.bulkDeleteProducts(dto);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProduct(id);
  }

  @Patch('products/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductRequestDto,
  ) {
    return this.adminService.updateProduct(id, dto);
  }

  // ─── 테마 아이템 ────────────────────────────────────────────────────

  @Post('theme-items')
  @HttpCode(HttpStatus.CREATED)
  createThemeItem(@Body() dto: CreateThemeItemRequestDto) {
    return this.adminService.createThemeItem(dto);
  }

  @Delete('theme-items')
  @HttpCode(HttpStatus.NO_CONTENT)
  bulkDeleteThemeItems(@Body() dto: BulkDeleteRequestDto) {
    return this.adminService.bulkDeleteThemeItems(dto);
  }

  @Delete('theme-items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteThemeItem(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteThemeItem(id);
  }

  @Patch('theme-items/:id')
  updateThemeItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateThemeItemRequestDto,
  ) {
    return this.adminService.updateThemeItem(id, dto);
  }
}
