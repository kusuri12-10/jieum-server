import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Reply } from '../../domain/entity/reply.entity.js';
import type {
  AdminReplyItem,
  ReplyRepository,
  ReplyWithQuestion,
} from '../../domain/repository/reply.repository.js';
import { ReplyOrmEntity } from '../orm/reply.orm-entity.js';

@Injectable()
export class ReplyRepositoryImpl implements ReplyRepository {
  constructor(
    @InjectRepository(ReplyOrmEntity)
    private readonly repo: Repository<ReplyOrmEntity>,
  ) {}

  async save(reply: Reply): Promise<Reply> {
    const orm = ReplyOrmEntity.fromDomain(reply);
    const saved = await this.repo.save(orm);
    return saved.toDomain();
  }

  async findByUserIdAndQuestionId(userId: number, questionId: number): Promise<Reply | null> {
    const orm = await this.repo.findOne({ where: { userId, questionId } });
    return orm ? orm.toDomain() : null;
  }

  async findAllByUserId(
    userId: number,
    page: number,
    size: number,
  ): Promise<{ replies: ReplyWithQuestion[]; totalCount: number }> {
    const [rows, totalCount] = await this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.question', 'q')
      .where('r.userId = :userId', { userId })
      .orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    const replies: ReplyWithQuestion[] = rows.map((r) => ({
      replyId: r.id,
      question: r.question?.content ?? '',
      content: r.content,
      createdAt: r.createdAt,
    }));

    return { replies, totalCount };
  }

  async findAllByQuestionId(
    questionId: number,
    page: number,
    size: number,
  ): Promise<{ replies: AdminReplyItem[]; totalCount: number }> {
    const [rows, totalCount] = await this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'u')
      .where('r.questionId = :questionId', { questionId })
      .orderBy('r.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    const replies: AdminReplyItem[] = rows.map((r) => ({
      replyId: r.id,
      userId: r.userId,
      nickname: r.user?.nickname ?? '',
      content: r.content,
      charCount: r.charCount,
      createdAt: r.createdAt,
    }));

    return { replies, totalCount };
  }

  async findLongestByUserId(userId: number): Promise<Reply | null> {
    const orm = await this.repo.findOne({
      where: { userId },
      order: { charCount: 'DESC' },
    });
    return orm ? orm.toDomain() : null;
  }

  async findShortestByUserId(userId: number): Promise<Reply | null> {
    const orm = await this.repo.findOne({
      where: { userId },
      order: { charCount: 'ASC' },
    });
    return orm ? orm.toDomain() : null;
  }

  async countByUserId(userId: number): Promise<number> {
    return this.repo.count({ where: { userId } });
  }
}
