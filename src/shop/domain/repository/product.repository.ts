import type { Product, ProductCategory } from '../entity/product.entity.js';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository {
  findAll(
    category?: ProductCategory,
    page?: number,
    size?: number,
  ): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByIdAdmin(id: number): Promise<Product | null>;
  findManyByIds(ids: number[]): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  softDeleteMany(ids: number[]): Promise<void>;
}
