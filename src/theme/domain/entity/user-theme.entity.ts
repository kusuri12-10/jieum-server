export class UserTheme {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly bottleThemeId: number | null,
    public readonly mailboxThemeId: number | null,
    public readonly mailThemeId: number | null,
  ) {}

  withBottleTheme(themeId: number): UserTheme {
    return new UserTheme(
      this.id, this.userId, themeId, this.mailboxThemeId, this.mailThemeId,
    );
  }

  withMailboxTheme(themeId: number): UserTheme {
    return new UserTheme(
      this.id, this.userId, this.bottleThemeId, themeId, this.mailThemeId,
    );
  }

  withMailTheme(themeId: number): UserTheme {
    return new UserTheme(
      this.id, this.userId, this.bottleThemeId, this.mailboxThemeId, themeId,
    );
  }

  static create(userId: number): UserTheme {
    return new UserTheme(0, userId, null, null, null);
  }
}
