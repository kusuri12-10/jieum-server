import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';
import { DAILY_QUESTION_REPOSITORY } from '../domain/repository/daily-question.repository';
import { REPLY_REPOSITORY } from '../domain/repository/reply.repository';
import { USER_REPOSITORY } from '../../user/domain/repository/user.repository';
import { DailyQuestion } from '../domain/entity/daily-question.entity';
import { Reply } from '../domain/entity/reply.entity';
import { User } from '../../user/domain/entity/user.entity';
import { ErrorCode } from '../../common/exception/error-code';

const mockQuestion = new DailyQuestion(
  42,
  '오늘 가장 인상 깊었던 순간은?',
  new Date('2026-05-06'),
);
const mockReply = new Reply(
  101,
  1,
  42,
  '오늘 처음으로 혼자 버스를 탔어요',
  18,
  new Date(),
);
const mockUser = new User(
  1,
  'test@test.com',
  'hashed_pw',
  '닉네임',
  100,
  30,
  new Date(),
  null,
);

const mockQuestionRepository = {
  findManyByDate: jest.fn(),
  findById: jest.fn(),
};

const mockReplyRepository = {
  save: jest.fn(),
  findByUserIdAndQuestionId: jest.fn(),
  findAllByUserId: jest.fn(),
  findLongestByUserId: jest.fn(),
  findShortestByUserId: jest.fn(),
  countByUserId: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue(10),
};

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: DAILY_QUESTION_REPOSITORY,
          useValue: mockQuestionRepository,
        },
        { provide: REPLY_REPOSITORY, useValue: mockReplyRepository },
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    jest.clearAllMocks();
  });

  describe('getTodayQuestion', () => {
    it('오늘의 질문과 답신 여부를 반환한다', async () => {
      mockQuestionRepository.findManyByDate.mockResolvedValue([mockQuestion]);
      mockReplyRepository.findByUserIdAndQuestionId.mockResolvedValue(null);

      const result = await service.getTodayQuestion(1);

      expect(result).toMatchObject({
        questionId: 42,
        content: '오늘 가장 인상 깊었던 순간은?',
        hasReplied: false,
      });
    });

    it('이미 답신했으면 hasReplied가 true다', async () => {
      mockQuestionRepository.findManyByDate.mockResolvedValue([mockQuestion]);
      mockReplyRepository.findByUserIdAndQuestionId.mockResolvedValue(
        mockReply,
      );

      const result = await service.getTodayQuestion(1);

      expect(result.hasReplied).toBe(true);
    });

    it('오늘의 질문이 없으면 QUESTION_NOT_FOUND 예외를 던진다', async () => {
      mockQuestionRepository.findManyByDate.mockResolvedValue([]);

      await expect(service.getTodayQuestion(1)).rejects.toMatchObject({
        response: { code: ErrorCode.QUESTION_NOT_FOUND.code },
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('submitReply', () => {
    const dto = { questionId: 42, content: '오늘 처음으로 혼자 버스를 탔어요' };

    it('답신 제출 성공 시 replyId, content, coinsEarned를 반환한다', async () => {
      mockQuestionRepository.findById.mockResolvedValue(mockQuestion);
      mockReplyRepository.findByUserIdAndQuestionId.mockResolvedValue(null);
      mockReplyRepository.save.mockResolvedValue(mockReply);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      const result = await service.submitReply(1, dto);

      expect(result).toMatchObject({ replyId: 101, coinsEarned: 10 });
    });

    it('답신 성공 시 코인을 지급한다', async () => {
      mockQuestionRepository.findById.mockResolvedValue(mockQuestion);
      mockReplyRepository.findByUserIdAndQuestionId.mockResolvedValue(null);
      mockReplyRepository.save.mockResolvedValue(mockReply);
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(undefined);

      await service.submitReply(1, dto);

      const updatedUser: User = mockUserRepository.update.mock.calls[0][0];
      expect(updatedUser.coins).toBe(110); // 100 + 10
    });

    it('질문이 없으면 QUESTION_NOT_FOUND 예외를 던진다', async () => {
      mockQuestionRepository.findById.mockResolvedValue(null);

      await expect(service.submitReply(1, dto)).rejects.toMatchObject({
        response: { code: ErrorCode.QUESTION_NOT_FOUND.code },
      });
    });

    it('이미 답신했으면 ALREADY_REPLIED 예외를 던진다', async () => {
      mockQuestionRepository.findById.mockResolvedValue(mockQuestion);
      mockReplyRepository.findByUserIdAndQuestionId.mockResolvedValue(
        mockReply,
      );

      await expect(service.submitReply(1, dto)).rejects.toMatchObject({
        response: { code: ErrorCode.ALREADY_REPLIED.code },
        status: HttpStatus.CONFLICT,
      });
    });
  });

  describe('getAllReplies', () => {
    it('페이지네이션된 답신 목록을 반환한다', async () => {
      const mockData = {
        replies: [
          {
            replyId: 101,
            question: '질문',
            content: '내용',
            createdAt: new Date(),
          },
        ],
        totalCount: 1,
      };
      mockReplyRepository.findAllByUserId.mockResolvedValue(mockData);

      const result = await service.getAllReplies(1, { page: 1, size: 20 });

      expect(result.totalCount).toBe(1);
      expect(result.replies).toHaveLength(1);
      expect(mockReplyRepository.findAllByUserId).toHaveBeenCalledWith(
        1,
        1,
        20,
      );
    });
  });
});
