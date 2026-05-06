import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductRequestDto {
  @IsOptional()
  @IsString({ message: '상품명은 문자열이어야 합니다.' })
  @MaxLength(100, { message: '상품명은 100자 이하여야 합니다.' })
  name?: string;

  @IsOptional()
  @IsString({ message: '상품 설명은 문자열이어야 합니다.' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: '이미지 URL 형식이 올바르지 않습니다.' })
  imageUrl?: string;

  @IsOptional()
  @IsInt({ message: '가격은 정수여야 합니다.' })
  @Min(0, { message: '가격은 0 이상이어야 합니다.' })
  price?: number;
}
