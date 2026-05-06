import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Purchase } from '../../domain/entity/purchase.entity.js';
import type { PurchaseRepository } from '../../domain/repository/purchase.repository.js';
import { PurchaseOrmEntity } from '../orm/purchase.orm-entity.js';

@Injectable()
export class PurchaseRepositoryImpl implements PurchaseRepository {
  constructor(
    @InjectRepository(PurchaseOrmEntity)
    private readonly repo: Repository<PurchaseOrmEntity>,
  ) {}

  async save(purchase: Purchase): Promise<Purchase> {
    const orm = PurchaseOrmEntity.fromDomain(purchase);
    const saved = await this.repo.save(orm);
    return saved.toDomain();
  }

  async findByUserIdAndProductId(
    userId: number,
    productId: number,
  ): Promise<Purchase | null> {
    const orm = await this.repo.findOne({ where: { userId, productId } });
    return orm ? orm.toDomain() : null;
  }

  async findProductIdsByUserId(userId: number): Promise<number[]> {
    const rows = await this.repo.find({
      where: { userId },
      select: ['productId'],
    });
    return rows.map((r) => r.productId);
  }
}
