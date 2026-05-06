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
import { AdminProductService } from '../application/admin-product.service.js';
import { CreateProductRequestDto } from '../application/dto/create-product.request.dto.js';
import { UpdateProductRequestDto } from '../application/dto/update-product.request.dto.js';
import { BulkDeleteRequestDto } from '../../shared/dto/bulk-delete.request.dto.js';

@Controller('admin/products')
@UseGuards(AdminGuard)
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProduct(@Body() dto: CreateProductRequestDto) {
    return this.adminProductService.createProduct(dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  bulkDeleteProducts(@Body() dto: BulkDeleteRequestDto) {
    return this.adminProductService.bulkDeleteProducts(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminProductService.deleteProduct(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductRequestDto,
  ) {
    return this.adminProductService.updateProduct(id, dto);
  }
}
