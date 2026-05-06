export class User {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly nickname: string,
    public readonly coins: number,
    public readonly streakGoal: number,
    public readonly createdAt: Date,
    public readonly deletedAt: Date | null,
    public readonly isAdmin: boolean = false,
  ) {}

  static create(props: {
    email: string;
    passwordHash: string;
    nickname: string;
  }): User {
    return new User(
      0,
      props.email,
      props.passwordHash,
      props.nickname,
      0,
      30,
      new Date(),
      null,
      false,
    );
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  withCoins(coins: number): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.nickname,
      coins,
      this.streakGoal,
      this.createdAt,
      this.deletedAt,
      this.isAdmin,
    );
  }

  withStreakGoal(streakGoal: number): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.nickname,
      this.coins,
      streakGoal,
      this.createdAt,
      this.deletedAt,
      this.isAdmin,
    );
  }

  withNickname(nickname: string): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      nickname,
      this.coins,
      this.streakGoal,
      this.createdAt,
      this.deletedAt,
      this.isAdmin,
    );
  }

  withdraw(): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.nickname,
      this.coins,
      this.streakGoal,
      this.createdAt,
      new Date(),
      this.isAdmin,
    );
  }
}
