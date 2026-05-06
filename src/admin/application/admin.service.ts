import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exception/business.exception.js';
import { ErrorCode } from '../../common/exception/error-code.js';
import { DailyQuestion } from '../../mail/domain/entity/daily-question.entity.js';
import {
  DAILY_QUESTION_REPOSITORY,
  type DailyQuestionRepository,
} from '../../mail/domain/repository/daily-question.repository.js';
import {
  REPLY_REPOSITORY,
  type ReplyRepository,
} from '../../mail/domain/repository/reply.repository.js';
import { Product } from '../../shop/domain/entity/product.entity.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../shop/domain/repository/product.repository.js';
import { ThemeItem } from '../../theme/domain/entity/theme-item.entity.js';
import {
  THEME_ITEM_REPOSITORY,
  type ThemeItemRepository,
} from '../../theme/domain/repository/theme-item.repository.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../auth/domain/repository/user.repository.js';
import type { CreateQuestionRequestDto } from './dto/create-question.request.dto.js';
import type { PaginationQueryDto } from './dto/pagination.query.dto.js';
import type { CreateProductRequestDto } from './dto/create-product.request.dto.js';
import type { UpdateProductRequestDto } from './dto/update-product.request.dto.js';
import type { BulkDeleteRequestDto } from './dto/bulk-delete.request.dto.js';
import type { CreateThemeItemRequestDto } from './dto/create-theme-item.request.dto.js';
import type { UpdateThemeItemRequestDto } from './dto/update-theme-item.request.dto.js';

@Injectable()
export class AdminService {
  constructor(
    @Inject(DAILY_QUESTION_REPOSITORY)
    private readonly dailyQuestionRepository: DailyQuestionRepository,
    @Inject(REPLY_REPOSITORY)
    private readonly replyRepository: ReplyRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(THEME_ITEM_REPOSITORY)
    private readonly themeItemRepository: ThemeItemRepository,
  ) {}

  // ─── 오늘의 질문 ───────────────────────────────────────────────────

  async createQuestion(dto: CreateQuestionRequestDto) {
    const questionDate = dto.questionDate
      ? new Date(dto.questionDate)
      : new Date();
    const existing =
      await this.dailyQuestionRepository.findByDate(questionDate);
    if (existing) {
      throw new BusinessException(
        ErrorCode.QUESTION_DATE_CONFLICT,
        HttpStatus.CONFLICT,
      );
    }

    const question = DailyQuestion.create({
      content: dto.content,
      questionDate,
    });
    const saved = await this.dailyQuestionRepository.save(question);

    return {
      questionId: saved.id,
      content: saved.content,
      questionDate: saved.questionDate.toISOString().split('T')[0],
    };
  }

  async deleteQuestion(id: number): Promise<void> {
    const question = await this.dailyQuestionRepository.findById(id);
    if (!question) {
      throw new BusinessException(
        ErrorCode.QUESTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.dailyQuestionRepository.delete(id);
  }

  async getQuestionReplies(questionId: number, query: PaginationQueryDto) {
    const question = await this.dailyQuestionRepository.findById(questionId);
    if (!question) {
      throw new BusinessException(
        ErrorCode.QUESTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const { replies, totalCount } =
      await this.replyRepository.findAllByQuestionId(
        questionId,
        query.page,
        query.size,
      );

    return {
      questionId: question.id,
      content: question.content,
      totalCount,
      replies,
    };
  }

  // ─── 유저 ──────────────────────────────────────────────────────────

  async getUser(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new BusinessException(
        ErrorCode.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
      coins: user.coins,
      streakGoal: user.streakGoal,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    };
  }

  // ─── 상품 ──────────────────────────────────────────────────────────

  async createProduct(dto: CreateProductRequestDto) {
    const product = Product.create(dto);
    const saved = await this.productRepository.save(product);

    return {
      productId: saved.id,
      name: saved.name,
      category: saved.category,
      price: saved.price,
    };
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findByIdAdmin(id);
    if (!product) {
      throw new BusinessException(
        ErrorCode.PRODUCT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.productRepository.update(product.deactivate());
  }

  async bulkDeleteProducts(dto: BulkDeleteRequestDto): Promise<void> {
    const found = await this.productRepository.findManyByIds(dto.ids);
    if (found.length !== dto.ids.length) {
      throw new BusinessException(
        ErrorCode.PRODUCT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.productRepository.softDeleteMany(dto.ids);
  }

  async updateProduct(id: number, dto: UpdateProductRequestDto) {
    const product = await this.productRepository.findByIdAdmin(id);
    if (!product) {
      throw new BusinessException(
        ErrorCode.PRODUCT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const updated = await this.productRepository.update(product.update(dto));

    return {
      productId: updated.id,
      name: updated.name,
      description: updated.description,
      imageUrl: updated.imageUrl,
      price: updated.price,
      category: updated.category,
    };
  }

  // ─── 테마 아이템 ────────────────────────────────────────────────────

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
