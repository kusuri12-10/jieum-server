import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { THEME_ITEM_REPOSITORY } from '../domain/repository/theme-item.repository';
import { USER_THEME_REPOSITORY } from '../domain/repository/user-theme.repository';
import { PURCHASE_REPOSITORY } from '../../shop/domain/repository/purchase.repository';
import { ThemeItem } from '../domain/entity/theme-item.entity';
import { UserTheme } from '../domain/entity/user-theme.entity';
import { Purchase } from '../../shop/domain/entity/purchase.entity';
import { ErrorCode } from '../../common/exception/error-code';

const freeTheme = new ThemeItem(
  1,
  'BOTTLE',
  '기본 유리병',
  'https://img1.png',
  null,
); // 무료
const paidTheme = new ThemeItem(
  2,
  'BOTTLE',
  '벚꽃 유리병',
  'https://img2.png',
  10,
); // 유료 (productId: 10)
const mailboxTheme = new ThemeItem(
  3,
  'MAILBOX',
  '기본 우편함',
  'https://img3.png',
  null,
);
const mockUserTheme = new UserTheme(1, 1, 1, null, null); // bottle: 1(기본), 나머지 null
const mockPurchase = new Purchase(1, 1, 10, new Date());

const mockThemeItemRepository = {
  findAllByType: jest.fn(),
  findById: jest.fn(),
};

const mockUserThemeRepository = {
  findByUserId: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockPurchaseRepository = {
  save: jest.fn(),
  findByUserIdAndProductId: jest.fn(),
  findProductIdsByUserId: jest.fn(),
};

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThemeService,
        { provide: THEME_ITEM_REPOSITORY, useValue: mockThemeItemRepository },
        { provide: USER_THEME_REPOSITORY, useValue: mockUserThemeRepository },
        { provide: PURCHASE_REPOSITORY, useValue: mockPurchaseRepository },
      ],
    }).compile();

    service = module.get<ThemeService>(ThemeService);
    jest.clearAllMocks();
  });

  describe('getThemes', () => {
    it('테마 목록과 잠금 여부, 선택 여부를 반환한다', async () => {
      mockThemeItemRepository.findAllByType.mockResolvedValue([
        freeTheme,
        paidTheme,
      ]);
      mockUserThemeRepository.findByUserId.mockResolvedValue(mockUserTheme);
      mockPurchaseRepository.findProductIdsByUserId.mockResolvedValue([10]); // paidTheme 구매

      const result = await service.getThemes(1, 'BOTTLE');

      expect(result.themes).toHaveLength(2);
      expect(result.themes[0]).toMatchObject({
        themeId: 1,
        isUnlocked: true,
        isSelected: true,
      });
      expect(result.themes[1]).toMatchObject({
        themeId: 2,
        isUnlocked: true,
        isSelected: false,
      });
    });

    it('무료 테마는 미구매 상태여도 isUnlocked가 true다', async () => {
      mockThemeItemRepository.findAllByType.mockResolvedValue([freeTheme]);
      mockUserThemeRepository.findByUserId.mockResolvedValue(mockUserTheme);
      mockPurchaseRepository.findProductIdsByUserId.mockResolvedValue([]);

      const result = await service.getThemes(1, 'BOTTLE');

      expect(result.themes[0].isUnlocked).toBe(true);
    });

    it('유료 테마를 미구매 상태면 isUnlocked가 false다', async () => {
      mockThemeItemRepository.findAllByType.mockResolvedValue([paidTheme]);
      mockUserThemeRepository.findByUserId.mockResolvedValue(mockUserTheme);
      mockPurchaseRepository.findProductIdsByUserId.mockResolvedValue([]); // 미구매

      const result = await service.getThemes(1, 'BOTTLE');

      expect(result.themes[0].isUnlocked).toBe(false);
    });
  });

  describe('changeTheme', () => {
    it('무료 테마는 구매 없이 변경 가능하다', async () => {
      mockThemeItemRepository.findById.mockResolvedValue(freeTheme);
      mockUserThemeRepository.findByUserId.mockResolvedValue(mockUserTheme);
      mockUserThemeRepository.update.mockResolvedValue(undefined);

      const result = await service.changeTheme(1, 'BOTTLE', 1);

      expect(result).toEqual({ themeId: 1, name: '기본 유리병' });
      expect(mockUserThemeRepository.update).toHaveBeenCalledTimes(1);
    });

    it('유료 테마를 구매한 경우 테마 변경에 성공한다', async () => {
      mockThemeItemRepository.findById.mockResolvedValue(paidTheme);
      mockPurchaseRepository.findByUserIdAndProductId.mockResolvedValue(
        mockPurchase,
      );
      mockUserThemeRepository.findByUserId.mockResolvedValue(mockUserTheme);
      mockUserThemeRepository.update.mockResolvedValue(undefined);

      const result = await service.changeTheme(1, 'BOTTLE', 2);

      expect(result).toEqual({ themeId: 2, name: '벚꽃 유리병' });
    });

    it('유료 테마를 미구매 상태로 변경 시도하면 THEME_NOT_UNLOCKED 예외를 던진다', async () => {
      mockThemeItemRepository.findById.mockResolvedValue(paidTheme);
      mockPurchaseRepository.findByUserIdAndProductId.mockResolvedValue(null); // 미구매

      await expect(service.changeTheme(1, 'BOTTLE', 2)).rejects.toMatchObject({
        response: { code: ErrorCode.THEME_NOT_UNLOCKED.code },
        status: HttpStatus.FORBIDDEN,
      });
    });

    it('존재하지 않는 테마면 THEME_NOT_FOUND 예외를 던진다', async () => {
      mockThemeItemRepository.findById.mockResolvedValue(null);

      await expect(service.changeTheme(1, 'BOTTLE', 999)).rejects.toMatchObject(
        {
          response: { code: ErrorCode.THEME_NOT_FOUND.code },
          status: HttpStatus.NOT_FOUND,
        },
      );
    });

    it('카테고리 불일치 시 THEME_NOT_FOUND 예외를 던진다', async () => {
      mockThemeItemRepository.findById.mockResolvedValue(mailboxTheme); // MAILBOX 타입

      await expect(service.changeTheme(1, 'BOTTLE', 3)).rejects.toMatchObject({
        response: { code: ErrorCode.THEME_NOT_FOUND.code },
      });
    });

    it('USER_THEME가 없으면 신규 생성 후 업데이트한다', async () => {
      const newUserTheme = new UserTheme(1, 1, null, null, null);
      mockThemeItemRepository.findById.mockResolvedValue(freeTheme);
      mockUserThemeRepository.findByUserId.mockResolvedValue(null); // 없음
      mockUserThemeRepository.save.mockResolvedValue(newUserTheme);
      mockUserThemeRepository.update.mockResolvedValue(undefined);

      await service.changeTheme(1, 'BOTTLE', 1);

      expect(mockUserThemeRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserThemeRepository.update).toHaveBeenCalledTimes(1);
    });
  });
});
