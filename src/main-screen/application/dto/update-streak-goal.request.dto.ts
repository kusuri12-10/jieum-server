import { IsInt, Min } from 'class-validator';

export class UpdateStreakGoalRequestDto {
  @IsInt({ message: '스트릭 목표는 정수여야 합니다.' })
  @Min(1, { message: '스트릭 목표는 1 이상이어야 합니다.' })
  streakGoal: number;
}
