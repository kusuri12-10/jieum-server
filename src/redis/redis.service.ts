import { Inject, Injectable } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants.js';

const LOGOUT_KEY_PREFIX = 'auth:logout:';
const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * 로그아웃 시각을 Redis에 저장
   * - Key: auth:logout:{userId}
   * - Value: 로그아웃 Unix timestamp
   * - TTL: 7일 (리프레시 토큰 최대 수명)
   */
  async setLogoutTime(userId: number, logoutAt: number): Promise<void> {
    await this.redis.set(
      `${LOGOUT_KEY_PREFIX}${userId}`,
      logoutAt,
      'EX',
      SEVEN_DAYS_SECONDS,
    );
  }

  /**
   * 토큰 유효성 검사
   * - 토큰 발급 시각(iat)이 마지막 로그아웃 시각 이전이면 무효
   */
  async isTokenValid(userId: number, iat: number): Promise<boolean> {
    const logoutAt = await this.redis.get(`${LOGOUT_KEY_PREFIX}${userId}`);
    if (!logoutAt) return true;
    return iat > Number(logoutAt);
  }
}
