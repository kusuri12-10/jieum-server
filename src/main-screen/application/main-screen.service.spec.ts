import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { MainScreenService } from './main-screen.service';
import { USER_REPOSITORY } from '../../user/domain/repository/user.repository';
import { STREAK_REPOSITORY } from '../domain/repository/streak.repository';
import { USER_THEME_REPOSITORY } from '../../theme/domain/repository/user-theme.repository';
import { User } from '../../user/domain/entity/user.entity';
import { Streak } from '../domain/entity/streak.entity';
import { UserTheme } from '../../theme/domain/entity/user-theme.entity';
import { ErrorCode } from '../../common/exception/error-code';

const mockUser = new User(
  1,
  'test@test.com',
  'hashed_pw',
  '닉네임',
  320,
  30,
  new Date(),
  null,
);
const mockStreaks = [
  new Streak(1, 1, new Date('2026-05-06'), true),
  new Streak(2, 1, new Date('2026-05-05'), true),
  new Streak(3, 1, new Date('2026-05-04'), false),
];
const mockUserTheme = new UserTheme(1, 1, 2, 1, 3);

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockStreakRepository = {
  findRecentByUserId: jest.fn(),
  countCurrentStreakByUserId: jest.fn(),
};

const mockUserThemeRepository = {
  findByUserId: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

describe('MainScreenService', () => {
  let service: MainScreenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MainScreenService,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: STREAK_REPOSITORY, useValue: mockStreakRepository },
        { provide: USER_THEME_REPOSITORY, useValue: mockUserThemeRepository },
      ],
    }).compile();

    service = module.get<MainScreenService>(MainScreenService);
    jest.clearAllMocks();
  });

  describe('getMainScreen', () => {
    it('메인화면 데이터를 올바르게 반환한다', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockStreakRepository.findRecentByUserId.mockResolvedValue(mockStreaks);
      mockStreakRepository.countCurrentStreakByUserId.mockResolvedValue(2);
      mockUserThemeRepository.findByUserId.mockResolvedValue(mockUserTheme);

      const result = await service.getMainScreen(1);

      expect(result).toMatchObject({
        nickname: '닉네임',
        coins: 320,
        streakGoal: 30,
        streakCurrent: 2,
        theme: { bottleThemeId: 2, mailboxThemeId: 1, mailThemeId: 3 },
      });
      expect(result.streakHistory).toHaveLength(3);
    });

    it('유저가 없으면 USER_NOT_FOUND 예외를 던진다', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.getMainScreen(999)).rejects.toMatchObject({
        response: { code: ErrorCode.USER_NOT_FOUND.code },
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('USER_THEME가 없으면 theme의 모든 값이 null이다', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockStreakRepository.findRecentByUserId.mockResolvedValue([]);
      mockStreakRepository.countCurrentStreakByUserId.mockResolvedValue(0);
      mockUserThemeRepository.findByUserId.mockResolvedValue(null);

      const result = await service.getMainScreen(1);

      expect(result.theme).toEqual({
        bottleThemeId: null,
        mailboxThemeId: null,
        mailThemeId: null,
      });
    });
  });

  describe('updateStreakGoal', () => {
    it('스트릭 목표를 변경하고 반환한다', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      const result = await service.updateStreakGoal(1, { streakGoal: 60 });

      expect(result).toEqual({ streakGoal: 60 });
      const updatedUser: User = mockUserRepository.update.mock.calls[0][0];
      expect(updatedUser.streakGoal).toBe(60);
    });

    it('유저가 없으면 USER_NOT_FOUND 예외를 던진다', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateStreakGoal(999, { streakGoal: 60 }),
      ).rejects.toMatchObject({
        response: { code: ErrorCode.USER_NOT_FOUND.code },
      });
    });
  });
});
