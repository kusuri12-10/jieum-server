import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BusinessException } from '../../common/exception/business.exception.js';
import { ErrorCode } from '../../common/exception/error-code.js';
import { Reply } from '../domain/entity/reply.entity.js';
import {
  DAILY_QUESTION_REPOSITORY,
  type DailyQuestionRepository,
} from '../domain/repository/daily-question.repository.js';
import {
  REPLY_REPOSITORY,
  type ReplyRepository,
} from '../domain/repository/reply.repository.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../user/domain/repository/user.repository.js';
import type { SubmitReplyRequestDto } from './dto/submit-reply.request.dto.js';
import type { ReplyAllQueryDto } from './dto/reply-all.query.dto.js';

@Injectable()
export class MailService {
  constructor(
    @Inject(DAILY_QUESTION_REPOSITORY)
    private readonly questionRepository: DailyQuestionRepository,
    @Inject(REPLY_REPOSITORY)
    private readonly replyRepository: ReplyRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async getTodayQuestion(userId: number) {
    const today = new Date();
    const questions = await this.questionRepository.findManyByDate(today);
    if (questions.length === 0) {
      throw new BusinessException(
        ErrorCode.QUESTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const question = questions[Math.floor(Math.random() * questions.length)];

    const existing = await this.replyRepository.findByUserIdAndQuestionId(
      userId,
      question.id,
    );

    return {
      questionId: question.id,
      content: question.content,
      date: question.questionDate.toISOString().split('T')[0],
      hasReplied: existing !== null,
    };
  }

  async submitReply(userId: number, dto: SubmitReplyRequestDto) {
    const question = await this.questionRepository.findById(dto.questionId);
    if (!question) {
      throw new BusinessException(
        ErrorCode.QUESTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const existing = await this.replyRepository.findByUserIdAndQuestionId(
      userId,
      dto.questionId,
    );
    if (existing) {
      throw new BusinessException(
        ErrorCode.ALREADY_REPLIED,
        HttpStatus.CONFLICT,
      );
    }

    const reply = Reply.create({
      userId,
      questionId: dto.questionId,
      content: dto.content,
    });
    const saved = await this.replyRepository.save(reply);

    const coinReward = this.configService.get<number>('REPLY_COIN_REWARD', 10);
    const user = await this.userRepository.findById(userId);
    if (user) {
      await this.userRepository.update(user.withCoins(user.coins + coinReward));
    }

    return {
      replyId: saved.id,
      content: saved.content,
      createdAt: saved.createdAt,
      coinsEarned: coinReward,
    };
  }

  async getAllReplies(userId: number, query: ReplyAllQueryDto) {
    const { replies, totalCount } = await this.replyRepository.findAllByUserId(
      userId,
      query.page,
      query.size,
    );
    return { totalCount, replies };
  }
}
