import type { UserTheme } from '../entity/user-theme.entity.js';

export const USER_THEME_REPOSITORY = Symbol('USER_THEME_REPOSITORY');

export interface UserThemeRepository {
  findByUserId(userId: number): Promise<UserTheme | null>;
  save(userTheme: UserTheme): Promise<UserTheme>;
  update(userTheme: UserTheme): Promise<UserTheme>;
}
