import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ShopService } from './shop.service';
import { PRODUCT_REPOSITORY } from '../domain/repository/product.repository';
import { PURCHASE_REPOSITORY } from '../domain/repository/purchase.repository';
import { USER_REPOSITORY } from '../../auth/domain/repository/user.repository';
import { Product } from '../domain/entity/product.entity';
import { Purchase } from '../domain/entity/purchase.entity';
import { User } from '../../auth/domain/entity/user.entity';
import { ErrorCode } from '../../common/exception/error-code';

const mockProduct = new Product(
  1,
  '벚꽃 유리병',
  '봄 향기...',
  'https://img.png',
  300,
  'BOTTLE',
  true,
);
const mockPurchase = new Purchase(1, 1, 1, new Date());
const mockUser = new User(
  1,
  'test@test.com',
  'hashed_pw',
  '닉네임',
  500,
  30,
  new Date(),
  null,
);
const poorUser = new User(
  2,
  'poor@test.com',
  'hashed_pw',
  '가난한닉',
  100,
  30,
  new Date(),
  null,
);

const mockProductRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
};

const mockPurchaseRepository = {
  save: jest.fn(),
  findByUserIdAndProductId: jest.fn(),
  findProductIdsByUserId: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

describe('ShopService', () => {
  let service: ShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopService,
        { provide: PRODUCT_REPOSITORY, useValue: mockProductRepository },
        { provide: PURCHASE_REPOSITORY, useValue: mockPurchaseRepository },
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<ShopService>(ShopService);
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('상품 목록과 구매 여부를 반환한다', async () => {
      mockProductRepository.findAll.mockResolvedValue([mockProduct]);
      mockPurchaseRepository.findProductIdsByUserId.mockResolvedValue([1]);

      const result = await service.getProducts(1, { page: 1, size: 20 });

      expect(result.products).toHaveLength(1);
      expect(result.products[0]).toMatchObject({
        productId: 1,
        name: '벚꽃 유리병',
        isPurchased: true,
      });
    });

    it('미구매 상품은 isPurchased가 false다', async () => {
      mockProductRepository.findAll.mockResolvedValue([mockProduct]);
      mockPurchaseRepository.findProductIdsByUserId.mockResolvedValue([]);

      const result = await service.getProducts(1, { page: 1, size: 20 });

      expect(result.products[0].isPurchased).toBe(false);
    });
  });

  describe('getProduct', () => {
    it('상품 상세와 구매 여부를 반환한다', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockPurchaseRepository.findByUserIdAndProductId.mockResolvedValue(
        mockPurchase,
      );

      const result = await service.getProduct(1, 1);

      expect(result).toMatchObject({
        productId: 1,
        description: '봄 향기...',
        isPurchased: true,
      });
    });

    it('상품이 없으면 PRODUCT_NOT_FOUND 예외를 던진다', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(service.getProduct(1, 999)).rejects.toMatchObject({
        response: { code: ErrorCode.PRODUCT_NOT_FOUND.code },
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('purchaseProduct', () => {
    it('구매 성공 시 productId와 remainingCoins를 반환한다', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockPurchaseRepository.findByUserIdAndProductId.mockResolvedValue(null);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPurchaseRepository.save.mockResolvedValue(mockPurchase);
      mockUserRepository.update.mockResolvedValue(undefined);

      const result = await service.purchaseProduct(1, 1);

      expect(result).toEqual({ productId: 1, remainingCoins: 200 }); // 500 - 300
    });

    it('구매 성공 시 코인을 차감한다', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockPurchaseRepository.findByUserIdAndProductId.mockResolvedValue(null);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPurchaseRepository.save.mockResolvedValue(mockPurchase);
      mockUserRepository.update.mockResolvedValue(undefined);

      await service.purchaseProduct(1, 1);

      const updatedUser: User = mockUserRepository.update.mock.calls[0][0];
      expect(updatedUser.coins).toBe(200); // 500 - 300
    });

    it('상품이 없으면 PRODUCT_NOT_FOUND 예외를 던진다', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(service.purchaseProduct(1, 999)).rejects.toMatchObject({
        response: { code: ErrorCode.PRODUCT_NOT_FOUND.code },
      });
    });

    it('이미 구매한 상품이면 ALREADY_PURCHASED 예외를 던진다', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockPurchaseRepository.findByUserIdAndProductId.mockResolvedValue(
        mockPurchase,
      );

      await expect(service.purchaseProduct(1, 1)).rejects.toMatchObject({
        response: { code: ErrorCode.ALREADY_PURCHASED.code },
        status: HttpStatus.CONFLICT,
      });
    });

    it('코인이 부족하면 INSUFFICIENT_COINS 예외를 던진다', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct); // price: 300
      mockPurchaseRepository.findByUserIdAndProductId.mockResolvedValue(null);
      mockUserRepository.findById.mockResolvedValue(poorUser); // coins: 100

      await expect(service.purchaseProduct(2, 1)).rejects.toMatchObject({
        response: { code: ErrorCode.INSUFFICIENT_COINS.code },
        status: HttpStatus.BAD_REQUEST,
      });
    });
  });
});
