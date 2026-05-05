import type { Streak } from '../entity/streak.entity.js';

export const STREAK_REPOSITORY = Symbol('STREAK_REPOSITORY');

export interface StreakRepository {
  findRecentByUserId(userId: number, limit: number): Promise<Streak[]>;
  countCurrentStreakByUserId(userId: number): Promise<number>;
}
