export class DailyQuestion {
  constructor(
    public readonly id: number,
    public readonly content: string,
    public readonly questionDate: Date,
  ) {}
}
