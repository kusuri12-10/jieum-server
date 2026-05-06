import { IsEnum, IsInt, IsNotEmpty, IsString, IsUrl, MaxLength, Min } from 'class-validator';
import type { ProductCategory } from '../../../shop/domain/entity/product.entity.js';

export class CreateProductRequestDto {
  @IsString({ message: '상품명은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '상품명을 입력해주세요.' })
  @MaxLength(100, { message: '상품명은 100자 이하여야 합니다.' })
  name: string;

  @IsString({ message: '상품 설명은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '상품 설명을 입력해주세요.' })
  description: string;

  @IsUrl({}, { message: '이미지 URL 형식이 올바르지 않습니다.' })
  @IsNotEmpty({ message: '이미지 URL을 입력해주세요.' })
  imageUrl: string;

  @IsInt({ message: '가격은 정수여야 합니다.' })
  @Min(0, { message: '가격은 0 이상이어야 합니다.' })
  price: number;

  @IsEnum(['BOTTLE', 'MAILBOX', 'MAIL'], { message: '카테고리는 BOTTLE, MAILBOX, MAIL 중 하나여야 합니다.' })
  category: ProductCategory;
}
