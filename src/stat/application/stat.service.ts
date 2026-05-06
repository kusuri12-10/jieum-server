import { Inject, Injectable } from '@nestjs/common';
import {
  REPLY_REPOSITORY,
  type ReplyRepository,
} from '../../mail/domain/repository/reply.repository.js';

@Injectable()
export class StatService {
  constructor(
    @Inject(REPLY_REPOSITORY)
    private readonly replyRepository: ReplyRepository,
  ) {}

  async getStat(userId: number) {
    const [totalReplies, longest, shortest] = await Promise.all([
      this.replyRepository.countByUserId(userId),
      this.replyRepository.findLongestByUserId(userId),
      this.replyRepository.findShortestByUserId(userId),
    ]);

    return {
      totalReplies,
      longestReply: longest
        ? {
            replyId: longest.id,
            content: longest.content,
            charCount: longest.charCount,
            date: longest.createdAt.toISOString().split('T')[0],
          }
        : null,
      shortestReply: shortest
        ? {
            replyId: shortest.id,
            content: shortest.content,
            charCount: shortest.charCount,
            date: shortest.createdAt.toISOString().split('T')[0],
          }
        : null,
    };
  }
}
