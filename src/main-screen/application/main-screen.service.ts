import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exception/business.exception.js';
import { ErrorCode } from '../../common/exception/error-code.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../auth/domain/repository/user.repository.js';
import {
  STREAK_REPOSITORY,
  type StreakRepository,
} from '../domain/repository/streak.repository.js';
import {
  USER_THEME_REPOSITORY,
  type UserThemeRepository,
} from '../../theme/domain/repository/user-theme.repository.js';
import type { UpdateStreakGoalRequestDto } from './dto/update-streak-goal.request.dto.js';

@Injectable()
export class MainScreenService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(STREAK_REPOSITORY)
    private readonly streakRepository: StreakRepository,
    @Inject(USER_THEME_REPOSITORY)
    private readonly userThemeRepository: UserThemeRepository,
  ) {}

  async getMainScreen(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BusinessException(
        ErrorCode.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const [streakHistory, streakCurrent, userTheme] = await Promise.all([
      this.streakRepository.findRecentByUserId(userId, 30),
      this.streakRepository.countCurrentStreakByUserId(userId),
      this.userThemeRepository.findByUserId(userId),
    ]);

    return {
      nickname: user.nickname,
      coins: user.coins,
      streakGoal: user.streakGoal,
      streakCurrent,
      streakHistory: streakHistory.map((s) => ({
        date: s.date.toISOString().split('T')[0],
        completed: s.completed,
      })),
      theme: userTheme
        ? {
            bottleThemeId: userTheme.bottleThemeId,
            mailboxThemeId: userTheme.mailboxThemeId,
            mailThemeId: userTheme.mailThemeId,
          }
        : { bottleThemeId: null, mailboxThemeId: null, mailThemeId: null },
    };
  }

  async updateStreakGoal(userId: number, dto: UpdateStreakGoalRequestDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BusinessException(
        ErrorCode.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userRepository.update(user.withStreakGoal(dto.streakGoal));
    return { streakGoal: dto.streakGoal };
  }
}
