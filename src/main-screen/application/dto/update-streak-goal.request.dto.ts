import { IsInt, Min } from 'class-validator';

export class UpdateStreakGoalRequestDto {
  @IsInt()
  @Min(1)
  streakGoal: number;
}
