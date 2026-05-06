import type { Reply } from '../entity/reply.entity.js';

export const REPLY_REPOSITORY = Symbol('REPLY_REPOSITORY');

export interface ReplyRepository {
  save(reply: Reply): Promise<Reply>;
  findByUserIdAndQuestionId(userId: number, questionId: number): Promise<Reply | null>;
  findAllByUserId(
    userId: number,
    page: number,
    size: number,
  ): Promise<{ replies: ReplyWithQuestion[]; totalCount: number }>;
  findAllByQuestionId(
    questionId: number,
    page: number,
    size: number,
  ): Promise<{ replies: AdminReplyItem[]; totalCount: number }>;
  findLongestByUserId(userId: number): Promise<Reply | null>;
  findShortestByUserId(userId: number): Promise<Reply | null>;
  countByUserId(userId: number): Promise<number>;
}

export interface ReplyWithQuestion {
  replyId: number;
  question: string;
  content: string;
  createdAt: Date;
}

export interface AdminReplyItem {
  replyId: number;
  userId: number;
  nickname: string;
  content: string;
  charCount: number;
  createdAt: Date;
}
