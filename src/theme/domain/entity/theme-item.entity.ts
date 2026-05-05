export type ThemeType = 'BOTTLE' | 'MAILBOX' | 'MAIL';

export class ThemeItem {
  constructor(
    public readonly id: number,
    public readonly type: ThemeType,
    public readonly name: string,
    public readonly imageUrl: string,
    public readonly productId: number | null,
  ) {}

  isFree(): boolean {
    return this.productId === null;
  }
}
