import { IsNumber, IsString, MinLength } from 'class-validator';

export class SubmitReplyRequestDto {
  @IsNumber()
  questionId: number;

  @IsString()
  @MinLength(1)
  content: string;
}
