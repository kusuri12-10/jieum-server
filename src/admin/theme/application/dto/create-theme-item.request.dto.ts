import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import type { ThemeType } from '../../../../theme/domain/entity/theme-item.entity.js';

export class CreateThemeItemRequestDto {
  @IsEnum(['BOTTLE', 'MAILBOX', 'MAIL'], {
    message: '타입은 BOTTLE, MAILBOX, MAIL 중 하나여야 합니다.',
  })
  type: ThemeType;

  @IsString({ message: '테마명은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '테마명을 입력해주세요.' })
  @MaxLength(100, { message: '테마명은 100자 이하여야 합니다.' })
  name: string;

  @IsUrl({}, { message: '이미지 URL 형식이 올바르지 않습니다.' })
  @IsNotEmpty({ message: '이미지 URL을 입력해주세요.' })
  imageUrl: string;

  @IsOptional()
  @IsInt({ message: '상품 ID는 정수여야 합니다.' })
  @Min(1, { message: '상품 ID는 1 이상이어야 합니다.' })
  productId?: number | null;
}
