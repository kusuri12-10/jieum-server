import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Streak } from '../../domain/entity/streak.entity.js';
import type { StreakRepository } from '../../domain/repository/streak.repository.js';
import { StreakOrmEntity } from '../orm/streak.orm-entity.js';

@Injectable()
export class StreakRepositoryImpl implements StreakRepository {
  constructor(
    @InjectRepository(StreakOrmEntity)
    private readonly repo: Repository<StreakOrmEntity>,
  ) {}

  async findRecentByUserId(userId: number, limit: number): Promise<Streak[]> {
    const rows = await this.repo.find({
      where: { userId },
      order: { date: 'DESC' },
      take: limit,
    });
    return rows.map((r) => r.toDomain());
  }

  async countCurrentStreakByUserId(userId: number): Promise<number> {
    // 오늘부터 연속으로 완료된 날 수를 계산
    const rows = await this.repo.find({
      where: { userId, completed: true },
      order: { date: 'DESC' },
    });

    if (rows.length === 0) return 0;

    let streak = 0;
    const expected = new Date();
    expected.setHours(0, 0, 0, 0);

    for (const row of rows) {
      const rowDate = new Date(row.date);
      rowDate.setHours(0, 0, 0, 0);

      if (rowDate.getTime() === expected.getTime()) {
        streak++;
        expected.setDate(expected.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}
