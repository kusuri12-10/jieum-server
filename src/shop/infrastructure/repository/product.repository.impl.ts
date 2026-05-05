import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Product, ProductCategory } from '../../domain/entity/product.entity.js';
import type { ProductRepository } from '../../domain/repository/product.repository.js';
import { ProductOrmEntity } from '../orm/product.orm-entity.js';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async findAll(category?: ProductCategory, page = 1, size = 20): Promise<Product[]> {
    const qb = this.repo
      .createQueryBuilder('p')
      .where('p.isActive = true')
      .skip((page - 1) * size)
      .take(size);

    if (category) {
      qb.andWhere('p.category = :category', { category });
    }

    const rows = await qb.getMany();
    return rows.map((r) => r.toDomain());
  }

  async findById(id: number): Promise<Product | null> {
    const orm = await this.repo.findOne({ where: { id, isActive: true } });
    return orm ? orm.toDomain() : null;
  }
}
