import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ThemeItem, ThemeType } from '../../domain/entity/theme-item.entity.js';
import type { ThemeItemRepository } from '../../domain/repository/theme-item.repository.js';
import { ThemeItemOrmEntity } from '../orm/theme-item.orm-entity.js';

@Injectable()
export class ThemeItemRepositoryImpl implements ThemeItemRepository {
  constructor(
    @InjectRepository(ThemeItemOrmEntity)
    private readonly repo: Repository<ThemeItemOrmEntity>,
  ) {}

  async findAllByType(type: ThemeType): Promise<ThemeItem[]> {
    const rows = await this.repo.find({ where: { type } });
    return rows.map((r) => r.toDomain());
  }

  async findById(id: number): Promise<ThemeItem | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? orm.toDomain() : null;
  }
}
