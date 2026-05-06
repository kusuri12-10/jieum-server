import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Purchase } from '../../domain/entity/purchase.entity.js';
import { UserOrmEntity } from '../../../auth/infrastructure/orm/user.orm-entity.js';
import { ProductOrmEntity } from './product.orm-entity.js';

@Entity('purchases')
@Unique(['userId', 'productId'])
export class PurchaseOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'product_id', type: 'bigint' })
  productId: number;

  @CreateDateColumn({ name: 'purchased_at' })
  purchasedAt: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @ManyToOne(() => ProductOrmEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

  static fromDomain(purchase: Purchase): PurchaseOrmEntity {
    const orm = new PurchaseOrmEntity();
    orm.userId = purchase.userId;
    orm.productId = purchase.productId;
    orm.purchasedAt = purchase.purchasedAt;
    return orm;
  }

  toDomain(): Purchase {
    return new Purchase(this.id, this.userId, this.productId, this.purchasedAt);
  }
}
