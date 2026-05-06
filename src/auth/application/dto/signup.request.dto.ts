import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupRequestDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
  @MaxLength(100, { message: '비밀번호는 100자 이하이어야 합니다.' })
  password: string;

  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @MinLength(1, { message: '닉네임을 입력해주세요.' })
  @MaxLength(50, { message: '닉네임은 50자 이하이어야 합니다.' })
  nickname: string;
}
