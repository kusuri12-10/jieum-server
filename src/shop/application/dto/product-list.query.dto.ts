import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import type { ProductCategory } from '../../domain/entity/product.entity.js';

export class ProductListQueryDto {
  @IsOptional()
  @IsEnum(['BOTTLE', 'MAILBOX', 'MAIL'], {
    message: 'category는 BOTTLE, MAILBOX, MAIL 중 하나여야 합니다.',
  })
  category?: ProductCategory;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page는 정수여야 합니다.' })
  @Min(1, { message: 'page는 1 이상이어야 합니다.' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'size는 정수여야 합니다.' })
  @Min(1, { message: 'size는 1 이상이어야 합니다.' })
  size: number = 20;
}
