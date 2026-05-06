import type { DailyQuestion } from '../entity/daily-question.entity.js';

export const DAILY_QUESTION_REPOSITORY = Symbol('DAILY_QUESTION_REPOSITORY');

export interface DailyQuestionRepository {
  findManyByDate(date: Date): Promise<DailyQuestion[]>;
  findById(id: number): Promise<DailyQuestion | null>;
  save(question: DailyQuestion): Promise<DailyQuestion>;
  delete(id: number): Promise<void>;
}
