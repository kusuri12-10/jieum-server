import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '../../../common/exception/business.exception.js';
import { ErrorCode } from '../../../common/exception/error-code.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../../user/domain/repository/user.repository.js';

@Injectable()
export class AdminUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async getUser(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new BusinessException(
        ErrorCode.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
      coins: user.coins,
      streakGoal: user.streakGoal,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    };
  }
}
