import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exception/business.exception.js';
import { ErrorCode } from '../../common/exception/error-code.js';
import type { ThemeType } from '../domain/entity/theme-item.entity.js';
import { UserTheme } from '../domain/entity/user-theme.entity.js';
import {
  THEME_ITEM_REPOSITORY,
  type ThemeItemRepository,
} from '../domain/repository/theme-item.repository.js';
import {
  USER_THEME_REPOSITORY,
  type UserThemeRepository,
} from '../domain/repository/user-theme.repository.js';
import {
  PURCHASE_REPOSITORY,
  type PurchaseRepository,
} from '../../shop/domain/repository/purchase.repository.js';

@Injectable()
export class ThemeService {
  constructor(
    @Inject(THEME_ITEM_REPOSITORY)
    private readonly themeItemRepository: ThemeItemRepository,
    @Inject(USER_THEME_REPOSITORY)
    private readonly userThemeRepository: UserThemeRepository,
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async getThemes(userId: number, type: ThemeType) {
    const [themes, userTheme, purchasedIds] = await Promise.all([
      this.themeItemRepository.findAllByType(type),
      this.userThemeRepository.findByUserId(userId),
      this.purchaseRepository.findProductIdsByUserId(userId),
    ]);

    const purchasedSet = new Set(purchasedIds);
    const selectedId = userTheme ? this.getSelectedId(userTheme, type) : null;

    return {
      themes: themes.map((t) => ({
        themeId: t.id,
        name: t.name,
        imageUrl: t.imageUrl,
        isUnlocked: t.isFree() || purchasedSet.has(t.productId!),
        isSelected: t.id === selectedId,
      })),
    };
  }

  async changeTheme(userId: number, type: ThemeType, themeId: number) {
    const theme = await this.themeItemRepository.findById(themeId);
    if (!theme || theme.type !== type) {
      throw new BusinessException(
        ErrorCode.THEME_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!theme.isFree()) {
      const purchase = await this.purchaseRepository.findByUserIdAndProductId(
        userId,
        theme.productId!,
      );
      if (!purchase) {
        throw new BusinessException(
          ErrorCode.THEME_NOT_UNLOCKED,
          HttpStatus.FORBIDDEN,
        );
      }
    }

    let userTheme = await this.userThemeRepository.findByUserId(userId);

    if (!userTheme) {
      userTheme = UserTheme.create(userId);
      userTheme = await this.userThemeRepository.save(userTheme);
    }

    const updated = this.applyThemeChange(userTheme, type, themeId);
    await this.userThemeRepository.update(updated);

    return { themeId: theme.id, name: theme.name };
  }

  private getSelectedId(userTheme: UserTheme, type: ThemeType): number | null {
    if (type === 'BOTTLE') return userTheme.bottleThemeId;
    if (type === 'MAILBOX') return userTheme.mailboxThemeId;
    return userTheme.mailThemeId;
  }

  private applyThemeChange(
    userTheme: UserTheme,
    type: ThemeType,
    themeId: number,
  ): UserTheme {
    if (type === 'BOTTLE') return userTheme.withBottleTheme(themeId);
    if (type === 'MAILBOX') return userTheme.withMailboxTheme(themeId);
    return userTheme.withMailTheme(themeId);
  }
}
