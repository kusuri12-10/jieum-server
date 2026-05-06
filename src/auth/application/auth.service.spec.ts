import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { USER_REPOSITORY } from '../domain/repository/user.repository';
import { User } from '../domain/entity/user.entity';
import { BusinessException } from '../../common/exception/business.exception';
import { ErrorCode } from '../../common/exception/error-code';
import { RedisService } from '../../redis/redis.service';

jest.mock('bcrypt');
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

const mockUser = new User(1, 'test@test.com', 'hashed_pw', '닉네임', 100, 30, new Date(), null);

const mockUserRepository = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('token'),
};

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('secret'),
  get: jest.fn().mockReturnValue('15m'),
};

const mockRedisService = {
  setLogoutTime: jest.fn().mockResolvedValue(undefined),
  isTokenValid: jest.fn().mockResolvedValue(true),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const dto = { email: 'test@test.com', password: 'password123', nickname: '닉네임' };

    it('회원가입 성공 시 userId, nickname, email을 반환한다', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcryptMock.hash as jest.Mock).mockResolvedValue('hashed_pw');
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.signup(dto);

      expect(result).toEqual({ userId: 1, nickname: '닉네임', email: 'test@test.com' });
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });

    it('이미 존재하는 이메일이면 EMAIL_ALREADY_EXISTS 예외를 던진다', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signup(dto)).rejects.toMatchObject({
        response: { code: ErrorCode.EMAIL_ALREADY_EXISTS.code },
        status: HttpStatus.CONFLICT,
      });
    });
  });

  describe('login', () => {
    const dto = { email: 'test@test.com', password: 'password123' };

    it('로그인 성공 시 accessToken, refreshToken, user를 반환한다', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcryptMock.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toEqual({ userId: 1, nickname: '닉네임', coins: 100 });
    });

    it('존재하지 않는 이메일이면 INVALID_CREDENTIALS 예외를 던진다', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toMatchObject({
        response: { code: ErrorCode.INVALID_CREDENTIALS.code },
        status: HttpStatus.UNAUTHORIZED,
      });
    });

    it('탈퇴한 계정이면 INVALID_CREDENTIALS 예외를 던진다', async () => {
      const deletedUser = new User(1, 'test@test.com', 'hashed_pw', '닉네임', 0, 30, new Date(), new Date());
      mockUserRepository.findByEmail.mockResolvedValue(deletedUser);

      await expect(service.login(dto)).rejects.toMatchObject({
        response: { code: ErrorCode.INVALID_CREDENTIALS.code },
      });
    });

    it('비밀번호가 틀리면 INVALID_CREDENTIALS 예외를 던진다', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcryptMock.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toMatchObject({
        response: { code: ErrorCode.INVALID_CREDENTIALS.code },
      });
    });
  });

  describe('logout', () => {
    it('로그아웃 시 Redis에 로그아웃 시각을 저장한다', async () => {
      const iat = Math.floor(Date.now() / 1000);

      await service.logout(1, iat);

      expect(mockRedisService.setLogoutTime).toHaveBeenCalledWith(1, iat);
    });
  });

  describe('withdraw', () => {
    it('탈퇴 성공 시 deleted_at이 설정된 유저로 업데이트한다', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      await service.withdraw(1);

      expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
      const updatedUser: User = mockUserRepository.update.mock.calls[0][0];
      expect(updatedUser.deletedAt).not.toBeNull();
    });

    it('존재하지 않는 유저면 USER_NOT_FOUND 예외를 던진다', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.withdraw(999)).rejects.toMatchObject({
        response: { code: ErrorCode.USER_NOT_FOUND.code },
        status: HttpStatus.NOT_FOUND,
      });
    });
  });
});
