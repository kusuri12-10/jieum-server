export class DailyQuestion {
  constructor(
    public readonly id: number,
    public readonly content: string,
    public readonly questionDate: Date,
  ) {}

  static create(props: { content: string; questionDate: Date }): DailyQuestion {
    return new DailyQuestion(0, props.content, props.questionDate);
  }
}
