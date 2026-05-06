import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserTheme } from '../../domain/entity/user-theme.entity.js';
import { UserOrmEntity } from '../../../auth/infrastructure/orm/user.orm-entity.js';

@Entity('user_themes')
export class UserThemeOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unique: true })
  userId: number;

  @Column({ name: 'bottle_theme_id', type: 'bigint', nullable: true, default: null })
  bottleThemeId: number | null;

  @Column({ name: 'mailbox_theme_id', type: 'bigint', nullable: true, default: null })
  mailboxThemeId: number | null;

  @Column({ name: 'mail_theme_id', type: 'bigint', nullable: true, default: null })
  mailThemeId: number | null;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  static fromDomain(ut: UserTheme): UserThemeOrmEntity {
    const orm = new UserThemeOrmEntity();
    if (ut.id) orm.id = ut.id;
    orm.userId = ut.userId;
    orm.bottleThemeId = ut.bottleThemeId;
    orm.mailboxThemeId = ut.mailboxThemeId;
    orm.mailThemeId = ut.mailThemeId;
    return orm;
  }

  toDomain(): UserTheme {
    return new UserTheme(
      this.id,
      this.userId,
      this.bottleThemeId,
      this.mailboxThemeId,
      this.mailThemeId,
    );
  }
}
