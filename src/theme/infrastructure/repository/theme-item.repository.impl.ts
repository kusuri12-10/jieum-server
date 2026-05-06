import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async findManyByIds(ids: number[]): Promise<ThemeItem[]> {
    if (ids.length === 0) return [];
    const rows = await this.repo.find({ where: { id: In(ids) } });
    return rows.map((r) => r.toDomain());
  }

  async save(item: ThemeItem): Promise<ThemeItem> {
    const orm = ThemeItemOrmEntity.fromDomain(item);
    const saved = await this.repo.save(orm);
    return saved.toDomain();
  }

  async update(item: ThemeItem): Promise<ThemeItem> {
    const orm = ThemeItemOrmEntity.fromDomain(item);
    await this.repo.save(orm);
    return item;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async deleteMany(ids: number[]): Promise<void> {
    if (ids.length === 0) return;
    await this.repo.delete({ id: In(ids) });
  }
}
