import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateNicknameRequestDto {
  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @MaxLength(50, { message: '닉네임은 50자 이하여야 합니다.' })
  nickname: string;
}
