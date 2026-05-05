export class Streak {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly date: Date,
    public readonly completed: boolean,
  ) {}

  static create(userId: number, date: Date): Streak {
    return new Streak(0, userId, date, false);
  }

  complete(): Streak {
    return new Streak(this.id, this.userId, this.date, true);
  }
}
