import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/orm/product.orm-entity.js';
import { PurchaseOrmEntity } from './infrastructure/orm/purchase.orm-entity.js';
import { ProductRepositoryImpl } from './infrastructure/repository/product.repository.impl.js';
import { PurchaseRepositoryImpl } from './infrastructure/repository/purchase.repository.impl.js';
import { ShopService } from './application/shop.service.js';
import { ShopController } from './presentation/shop.controller.js';
import { PRODUCT_REPOSITORY } from './domain/repository/product.repository.js';
import { PURCHASE_REPOSITORY } from './domain/repository/purchase.repository.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrmEntity, PurchaseOrmEntity]),
    AuthModule,
  ],
  controllers: [ShopController],
  providers: [
    ShopService,
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepositoryImpl },
    { provide: PURCHASE_REPOSITORY, useClass: PurchaseRepositoryImpl },
  ],
  exports: [PRODUCT_REPOSITORY, PURCHASE_REPOSITORY],
})
export class ShopModule {}
