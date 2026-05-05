import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UserTheme } from '../../domain/entity/user-theme.entity.js';
import type { UserThemeRepository } from '../../domain/repository/user-theme.repository.js';
import { UserThemeOrmEntity } from '../orm/user-theme.orm-entity.js';

@Injectable()
export class UserThemeRepositoryImpl implements UserThemeRepository {
  constructor(
    @InjectRepository(UserThemeOrmEntity)
    private readonly repo: Repository<UserThemeOrmEntity>,
  ) {}

  async findByUserId(userId: number): Promise<UserTheme | null> {
    const orm = await this.repo.findOne({ where: { userId } });
    return orm ? orm.toDomain() : null;
  }

  async save(userTheme: UserTheme): Promise<UserTheme> {
    const orm = UserThemeOrmEntity.fromDomain(userTheme);
    const saved = await this.repo.save(orm);
    return saved.toDomain();
  }

  async update(userTheme: UserTheme): Promise<UserTheme> {
    const orm = UserThemeOrmEntity.fromDomain(userTheme);
    await this.repo.save(orm);
    return userTheme;
  }
}
