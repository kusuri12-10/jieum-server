import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { DailyQuestion } from '../../domain/entity/daily-question.entity.js';
import type { DailyQuestionRepository } from '../../domain/repository/daily-question.repository.js';
import { DailyQuestionOrmEntity } from '../orm/daily-question.orm-entity.js';

@Injectable()
export class DailyQuestionRepositoryImpl implements DailyQuestionRepository {
  constructor(
    @InjectRepository(DailyQuestionOrmEntity)
    private readonly repo: Repository<DailyQuestionOrmEntity>,
  ) {}

  async findByDate(date: Date): Promise<DailyQuestion | null> {
    const dateStr = date.toISOString().split('T')[0];
    const orm = await this.repo
      .createQueryBuilder('q')
      .where('DATE(q.questionDate) = :date', { date: dateStr })
      .getOne();
    return orm ? orm.toDomain() : null;
  }

  async findById(id: number): Promise<DailyQuestion | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? orm.toDomain() : null;
  }

  async save(question: DailyQuestion): Promise<DailyQuestion> {
    const orm = DailyQuestionOrmEntity.fromDomain(question);
    const saved = await this.repo.save(orm);
    return saved.toDomain();
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
