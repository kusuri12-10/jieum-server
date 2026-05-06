import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exception/business.exception.js';
import { ErrorCode } from '../../common/exception/error-code.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/repository/user.repository.js';
import type { UpdateNicknameRequestDto } from './dto/update-nickname.request.dto.js';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async updateNickname(userId: number, dto: UpdateNicknameRequestDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BusinessException(
        ErrorCode.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const updated = await this.userRepository.update(
      user.withNickname(dto.nickname),
    );

    return { nickname: updated.nickname };
  }

  async withdraw(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BusinessException(
        ErrorCode.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepository.update(user.withdraw());
  }
}
