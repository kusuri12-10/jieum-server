import { IsInt, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class UpdateThemeItemRequestDto {
  @IsOptional()
  @IsString({ message: '테마명은 문자열이어야 합니다.' })
  @MaxLength(100, { message: '테마명은 100자 이하여야 합니다.' })
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: '이미지 URL 형식이 올바르지 않습니다.' })
  imageUrl?: string;

  @IsOptional()
  @IsInt({ message: '상품 ID는 정수여야 합니다.' })
  @Min(1, { message: '상품 ID는 1 이상이어야 합니다.' })
  productId?: number | null;
}
