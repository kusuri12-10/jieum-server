import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DailyQuestion } from '../../domain/entity/daily-question.entity.js';

@Entity('daily_questions')
export class DailyQuestionOrmEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 500 })
  content: string;

  @Column({ name: 'question_date', type: 'date', unique: true })
  questionDate: Date;

  static fromDomain(q: DailyQuestion): DailyQuestionOrmEntity {
    const orm = new DailyQuestionOrmEntity();
    if (q.id) orm.id = q.id;
    orm.content = q.content;
    orm.questionDate = q.questionDate;
    return orm;
  }

  toDomain(): DailyQuestion {
    return new DailyQuestion(this.id, this.content, this.questionDate);
  }
}
