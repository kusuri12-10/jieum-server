import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Streak } from '../../domain/entity/streak.entity.js';
import { UserOrmEntity } from '../../../user/infrastructure/orm/user.orm-entity.js';

@Entity('streaks')
export class StreakOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  toDomain(): Streak {
    return new Streak(this.id, this.userId, this.date, this.completed);
  }
}
