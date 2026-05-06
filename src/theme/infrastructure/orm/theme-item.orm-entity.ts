import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ThemeItem,
  type ThemeType,
} from '../../domain/entity/theme-item.entity.js';
import { ProductOrmEntity } from '../../../shop/infrastructure/orm/product.orm-entity.js';

@Entity('theme_items')
export class ThemeItemOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'enum', enum: ['BOTTLE', 'MAILBOX', 'MAIL'] })
  type: ThemeType;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ name: 'product_id', type: 'bigint', nullable: true, default: null })
  productId: number | null;

  @ManyToOne(() => ProductOrmEntity, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity | null;

  static fromDomain(item: ThemeItem): ThemeItemOrmEntity {
    const orm = new ThemeItemOrmEntity();
    if (item.id) orm.id = item.id;
    orm.type = item.type;
    orm.name = item.name;
    orm.imageUrl = item.imageUrl;
    orm.productId = item.productId;
    return orm;
  }

  toDomain(): ThemeItem {
    return new ThemeItem(
      this.id,
      this.type,
      this.name,
      this.imageUrl,
      this.productId,
    );
  }
}
