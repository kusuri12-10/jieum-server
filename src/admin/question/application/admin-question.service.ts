import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '../../../common/exception/business.exception.js';
import { ErrorCode } from '../../../common/exception/error-code.js';
import { DailyQuestion } from '../../../mail/domain/entity/daily-question.entity.js';
import {
  DAILY_QUESTION_REPOSITORY,
  type DailyQuestionRepository,
} from '../../../mail/domain/repository/daily-question.repository.js';
import {
  REPLY_REPOSITORY,
  type ReplyRepository,
} from '../../../mail/domain/repository/reply.repository.js';
import type { CreateQuestionRequestDto } from './dto/create-question.request.dto.js';
import type { PaginationQueryDto } from '../../shared/dto/pagination.query.dto.js';

@Injectable()
export class AdminQuestionService {
  constructor(
    @Inject(DAILY_QUESTION_REPOSITORY)
    private readonly dailyQuestionRepository: DailyQuestionRepository,
    @Inject(REPLY_REPOSITORY)
    private readonly replyRepository: ReplyRepository,
  ) {}

  async createQuestion(dto: CreateQuestionRequestDto) {
    const questionDate = dto.questionDate
      ? new Date(dto.questionDate)
      : new Date();
    const existing =
      await this.dailyQuestionRepository.findByDate(questionDate);
    if (existing) {
      throw new BusinessException(
        ErrorCode.QUESTION_DATE_CONFLICT,
        HttpStatus.CONFLICT,
      );
    }

    const question = DailyQuestion.create({
      content: dto.content,
      questionDate,
    });
    const saved = await this.dailyQuestionRepository.save(question);

    return {
      questionId: saved.id,
      content: saved.content,
      questionDate: saved.questionDate.toISOString().split('T')[0],
    };
  }

  async deleteQuestion(id: number): Promise<void> {
    const question = await this.dailyQuestionRepository.findById(id);
    if (!question) {
      throw new BusinessException(
        ErrorCode.QUESTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.dailyQuestionRepository.delete(id);
  }

  async getQuestionReplies(questionId: number, query: PaginationQueryDto) {
    const question = await this.dailyQuestionRepository.findById(questionId);
    if (!question) {
      throw new BusinessException(
        ErrorCode.QUESTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const { replies, totalCount } =
      await this.replyRepository.findAllByQuestionId(
        questionId,
        query.page,
        query.size,
      );

    return {
      questionId: question.id,
      content: question.content,
      totalCount,
      replies,
    };
  }
}
