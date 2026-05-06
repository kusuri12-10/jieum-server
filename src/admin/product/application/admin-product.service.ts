import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '../../../common/exception/business.exception.js';
import { ErrorCode } from '../../../common/exception/error-code.js';
import { Product } from '../../../shop/domain/entity/product.entity.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../../shop/domain/repository/product.repository.js';
import type { CreateProductRequestDto } from './dto/create-product.request.dto.js';
import type { UpdateProductRequestDto } from './dto/update-product.request.dto.js';
import type { BulkDeleteRequestDto } from '../../shared/dto/bulk-delete.request.dto.js';

@Injectable()
export class AdminProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

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
}
