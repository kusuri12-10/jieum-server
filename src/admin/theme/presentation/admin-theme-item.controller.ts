import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../../common/guard/admin.guard.js';
import { AdminThemeItemService } from '../application/admin-theme-item.service.js';
import { CreateThemeItemRequestDto } from '../application/dto/create-theme-item.request.dto.js';
import { UpdateThemeItemRequestDto } from '../application/dto/update-theme-item.request.dto.js';
import { BulkDeleteRequestDto } from '../../shared/dto/bulk-delete.request.dto.js';

@Controller('admin/theme-items')
@UseGuards(AdminGuard)
export class AdminThemeItemController {
  constructor(private readonly adminThemeItemService: AdminThemeItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createThemeItem(@Body() dto: CreateThemeItemRequestDto) {
    return this.adminThemeItemService.createThemeItem(dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  bulkDeleteThemeItems(@Body() dto: BulkDeleteRequestDto) {
    return this.adminThemeItemService.bulkDeleteThemeItems(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteThemeItem(@Param('id', ParseIntPipe) id: number) {
    return this.adminThemeItemService.deleteThemeItem(id);
  }

  @Patch(':id')
  updateThemeItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateThemeItemRequestDto,
  ) {
    return this.adminThemeItemService.updateThemeItem(id, dto);
  }
}
