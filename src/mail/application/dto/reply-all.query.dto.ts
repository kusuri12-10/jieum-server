import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ReplyAllQueryDto {
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
