import { Test, TestingModule } from '@nestjs/testing';
import { StatService } from './stat.service';
import { REPLY_REPOSITORY } from '../../mail/domain/repository/reply.repository';
import { Reply } from '../../mail/domain/entity/reply.entity';

const longReply = new Reply(
  55,
  1,
  1,
  '긴 답변...',
  842,
  new Date('2026-04-15'),
);
const shortReply = new Reply(12, 1, 2, '좋았다.', 4, new Date('2026-03-10'));

const mockReplyRepository = {
  save: jest.fn(),
  findByUserIdAndQuestionId: jest.fn(),
  findAllByUserId: jest.fn(),
  findLongestByUserId: jest.fn(),
  findShortestByUserId: jest.fn(),
  countByUserId: jest.fn(),
};

describe('StatService', () => {
  let service: StatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatService,
        { provide: REPLY_REPOSITORY, useValue: mockReplyRepository },
      ],
    }).compile();

    service = module.get<StatService>(StatService);
    jest.clearAllMocks();
  });

  describe('getStat', () => {
    it('총 답변 수, 최장/최단 답변을 반환한다', async () => {
      mockReplyRepository.countByUserId.mockResolvedValue(87);
      mockReplyRepository.findLongestByUserId.mockResolvedValue(longReply);
      mockReplyRepository.findShortestByUserId.mockResolvedValue(shortReply);

      const result = await service.getStat(1);

      expect(result).toMatchObject({
        totalReplies: 87,
        longestReply: { replyId: 55, charCount: 842 },
        shortestReply: { replyId: 12, charCount: 4 },
      });
    });

    it('답변이 없으면 longestReply와 shortestReply가 null이다', async () => {
      mockReplyRepository.countByUserId.mockResolvedValue(0);
      mockReplyRepository.findLongestByUserId.mockResolvedValue(null);
      mockReplyRepository.findShortestByUserId.mockResolvedValue(null);

      const result = await service.getStat(1);

      expect(result).toMatchObject({
        totalReplies: 0,
        longestReply: null,
        shortestReply: null,
      });
    });
  });
});
