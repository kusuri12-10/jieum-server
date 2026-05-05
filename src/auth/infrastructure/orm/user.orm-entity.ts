import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../domain/entity/user.entity.js';

@Entity('user')
export class UserOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50 })
  nickname: string;

  @Column({ type: 'int', default: 0 })
  coins: number;

  @Column({ name: 'streak_goal', type: 'int', default: 30 })
  streakGoal: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;

  static fromDomain(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    if (user.id) orm.id = user.id;
    orm.email = user.email;
    orm.passwordHash = user.passwordHash;
    orm.nickname = user.nickname;
    orm.coins = user.coins;
    orm.streakGoal = user.streakGoal;
    orm.createdAt = user.createdAt;
    orm.deletedAt = user.deletedAt;
    return orm;
  }

  toDomain(): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.nickname,
      this.coins,
      this.streakGoal,
      this.createdAt,
      this.deletedAt,
    );
  }
}
