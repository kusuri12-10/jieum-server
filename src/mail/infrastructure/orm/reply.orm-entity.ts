import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reply } from '../../domain/entity/reply.entity.js';
import { UserOrmEntity } from '../../../auth/infrastructure/orm/user.orm-entity.js';
import { DailyQuestionOrmEntity } from './daily-question.orm-entity.js';

@Entity('reply')
export class ReplyOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ name: 'question_id', type: 'bigint' })
  questionId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'char_count', type: 'int' })
  charCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @ManyToOne(() => DailyQuestionOrmEntity)
  @JoinColumn({ name: 'question_id' })
  question: DailyQuestionOrmEntity;

  static fromDomain(reply: Reply): ReplyOrmEntity {
    const orm = new ReplyOrmEntity();
    orm.userId = reply.userId;
    orm.questionId = reply.questionId;
    orm.content = reply.content;
    orm.charCount = reply.charCount;
    orm.createdAt = reply.createdAt;
    return orm;
  }

  toDomain(): Reply {
    return new Reply(
      this.id,
      this.userId,
      this.questionId,
      this.content,
      this.charCount,
      this.createdAt,
    );
  }
}
