import { IsNumber, IsString, MinLength } from 'class-validator';

export class SubmitReplyRequestDto {
  @IsNumber({}, { message: '질문 ID는 숫자여야 합니다.' })
  questionId: number;

  @IsString({ message: '답신 내용은 문자열이어야 합니다.' })
  @MinLength(1, { message: '답신 내용을 입력해주세요.' })
  content: string;
}
