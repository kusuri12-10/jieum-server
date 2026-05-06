import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateQuestionRequestDto {
  @IsString({ message: '질문 내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '질문 내용을 입력해주세요.' })
  @MaxLength(500, { message: '질문 내용은 500자 이하여야 합니다.' })
  content: string;

  @IsDateString({}, { message: '날짜 형식이 올바르지 않습니다. (yyyy-MM-dd)' })
  @IsOptional()
  questionDate?: string;
}
