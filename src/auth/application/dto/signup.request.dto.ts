import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  nickname: string;
}
