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

  toDomain(): DailyQuestion {
    return new DailyQuestion(this.id, this.content, this.questionDate);
  }
}
