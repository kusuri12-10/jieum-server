import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '../../../common/exception/business.exception.js';
import { ErrorCode } from '../../../common/exception/error-code.js';
import { ThemeItem } from '../../../theme/domain/entity/theme-item.entity.js';
import {
  THEME_ITEM_REPOSITORY,
  type ThemeItemRepository,
} from '../../../theme/domain/repository/theme-item.repository.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../../shop/domain/repository/product.repository.js';
import type { CreateThemeItemRequestDto } from './dto/create-theme-item.request.dto.js';
import type { UpdateThemeItemRequestDto } from './dto/update-theme-item.request.dto.js';
import type { BulkDeleteRequestDto } from '../../shared/dto/bulk-delete.request.dto.js';

@Injectable()
export class AdminThemeItemService {
  constructor(
    @Inject(THEME_ITEM_REPOSITORY)
    private readonly themeItemRepository: ThemeItemRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async createThemeItem(dto: CreateThemeItemRequestDto) {
    if (dto.productId != null) {
      const product = await this.productRepository.findByIdAdmin(dto.productId);
      if (!product) {
        throw new BusinessException(
          ErrorCode.PRODUCT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const item = ThemeItem.create(dto);
    const saved = await this.themeItemRepository.save(item);

    return {
      themeItemId: saved.id,
      type: saved.type,
      name: saved.name,
      imageUrl: saved.imageUrl,
      productId: saved.productId,
    };
  }

  async deleteThemeItem(id: number): Promise<void> {
    const item = await this.themeItemRepository.findById(id);
    if (!item) {
      throw new BusinessException(
        ErrorCode.THEME_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.themeItemRepository.delete(id);
  }

  async bulkDeleteThemeItems(dto: BulkDeleteRequestDto): Promise<void> {
    const found = await this.themeItemRepository.findManyByIds(dto.ids);
    if (found.length !== dto.ids.length) {
      throw new BusinessException(
        ErrorCode.THEME_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.themeItemRepository.deleteMany(dto.ids);
  }

  async updateThemeItem(id: number, dto: UpdateThemeItemRequestDto) {
    const item = await this.themeItemRepository.findById(id);
    if (!item) {
      throw new BusinessException(
        ErrorCode.THEME_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (dto.productId != null) {
      const product = await this.productRepository.findByIdAdmin(dto.productId);
      if (!product) {
        throw new BusinessException(
          ErrorCode.PRODUCT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const updated = await this.themeItemRepository.update(item.update(dto));

    return {
      themeItemId: updated.id,
      type: updated.type,
      name: updated.name,
      imageUrl: updated.imageUrl,
      productId: updated.productId,
    };
  }
}
