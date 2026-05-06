import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product, type ProductCategory } from '../../domain/entity/product.entity.js';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'enum', enum: ['BOTTLE', 'MAILBOX', 'MAIL'] })
  category: ProductCategory;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  static fromDomain(product: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    if (product.id) orm.id = product.id;
    orm.name = product.name;
    orm.description = product.description;
    orm.imageUrl = product.imageUrl;
    orm.price = product.price;
    orm.category = product.category;
    orm.isActive = product.isActive;
    return orm;
  }

  toDomain(): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      this.imageUrl,
      this.price,
      this.category,
      this.isActive,
    );
  }
}
