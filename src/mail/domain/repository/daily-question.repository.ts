import type { DailyQuestion } from '../entity/daily-question.entity.js';

export const DAILY_QUESTION_REPOSITORY = Symbol('DAILY_QUESTION_REPOSITORY');

export interface DailyQuestionRepository {
  findByDate(date: Date): Promise<DailyQuestion | null>;
  findById(id: number): Promise<DailyQuestion | null>;
  save(question: DailyQuestion): Promise<DailyQuestion>;
  delete(id: number): Promise<void>;
}
