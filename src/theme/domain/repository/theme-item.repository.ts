import type { ThemeItem, ThemeType } from '../entity/theme-item.entity.js';

export const THEME_ITEM_REPOSITORY = Symbol('THEME_ITEM_REPOSITORY');

export interface ThemeItemRepository {
  findAllByType(type: ThemeType): Promise<ThemeItem[]>;
  findById(id: number): Promise<ThemeItem | null>;
  findManyByIds(ids: number[]): Promise<ThemeItem[]>;
  save(item: ThemeItem): Promise<ThemeItem>;
  update(item: ThemeItem): Promise<ThemeItem>;
  delete(id: number): Promise<void>;
  deleteMany(ids: number[]): Promise<void>;
}
