import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product, type ProductCategory } from '../../domain/entity/product.entity.js';

@Entity('product')
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
