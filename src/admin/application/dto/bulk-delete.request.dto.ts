import { ArrayMinSize, IsArray, IsInt } from 'class-validator';

export class BulkDeleteRequestDto {
  @IsArray({ message: '삭제할 ID 목록은 배열이어야 합니다.' })
  @ArrayMinSize(1, { message: '삭제할 ID를 1개 이상 입력해주세요.' })
  @IsInt({ each: true, message: 'ID는 정수여야 합니다.' })
  ids: number[];
}
