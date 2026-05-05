import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import type { ProductCategory } from '../../domain/entity/product.entity.js';

export class ProductListQueryDto {
  @IsOptional()
  @IsEnum(['BOTTLE', 'MAILBOX', 'MAIL'])
  category?: ProductCategory;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size: number = 20;
}
