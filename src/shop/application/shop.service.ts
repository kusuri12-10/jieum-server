import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '../../common/exception/business.exception.js';
import { ErrorCode } from '../../common/exception/error-code.js';
import { Purchase } from '../domain/entity/purchase.entity.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../domain/repository/product.repository.js';
import {
  PURCHASE_REPOSITORY,
  type PurchaseRepository,
} from '../domain/repository/purchase.repository.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../auth/domain/repository/user.repository.js';
import type { ProductListQueryDto } from './dto/product-list.query.dto.js';

@Injectable()
export class ShopService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async getProducts(userId: number, query: ProductListQueryDto) {
    const [products, purchasedIds] = await Promise.all([
      this.productRepository.findAll(query.category, query.page, query.size),
      this.purchaseRepository.findProductIdsByUserId(userId),
    ]);

    const purchasedSet = new Set(purchasedIds);

    return {
      products: products.map((p) => ({
        productId: p.id,
        name: p.name,
        imageUrl: p.imageUrl,
        price: p.price,
        category: p.category,
        isPurchased: purchasedSet.has(p.id),
      })),
    };
  }

  async getProduct(userId: number, productId: number) {
    const [product, purchase] = await Promise.all([
      this.productRepository.findById(productId),
      this.purchaseRepository.findByUserIdAndProductId(userId, productId),
    ]);

    if (!product) {
      throw new BusinessException(
        ErrorCode.PRODUCT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      productId: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price,
      category: product.category,
      isPurchased: purchase !== null,
    };
  }

  async purchaseProduct(userId: number, productId: number) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new BusinessException(
        ErrorCode.PRODUCT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const existing = await this.purchaseRepository.findByUserIdAndProductId(
      userId,
      productId,
    );
    if (existing) {
      throw new BusinessException(
        ErrorCode.ALREADY_PURCHASED,
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BusinessException(
        ErrorCode.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.coins < product.price) {
      throw new BusinessException(
        ErrorCode.INSUFFICIENT_COINS,
        HttpStatus.BAD_REQUEST,
      );
    }

    await Promise.all([
      this.purchaseRepository.save(Purchase.create(userId, productId)),
      this.userRepository.update(user.withCoins(user.coins - product.price)),
    ]);

    return {
      productId: product.id,
      remainingCoins: user.coins - product.price,
    };
  }
}
