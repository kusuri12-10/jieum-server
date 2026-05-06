import type { Purchase } from '../entity/purchase.entity.js';

export const PURCHASE_REPOSITORY = Symbol('PURCHASE_REPOSITORY');

export interface PurchaseRepository {
  save(purchase: Purchase): Promise<Purchase>;
  findByUserIdAndProductId(
    userId: number,
    productId: number,
  ): Promise<Purchase | null>;
  findProductIdsByUserId(userId: number): Promise<number[]>;
}
