export class Reply {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly questionId: number,
    public readonly content: string,
    public readonly charCount: number,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    userId: number;
    questionId: number;
    content: string;
  }): Reply {
    return new Reply(
      0,
      props.userId,
      props.questionId,
      props.content,
      props.content.length,
      new Date(),
    );
  }
}
