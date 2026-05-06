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

  static create(props: {
    type: ThemeType;
    name: string;
    imageUrl: string;
    productId?: number | null;
  }): ThemeItem {
    return new ThemeItem(0, props.type, props.name, props.imageUrl, props.productId ?? null);
  }

  update(props: { name?: string; imageUrl?: string; productId?: number | null }): ThemeItem {
    return new ThemeItem(
      this.id,
      this.type,
      props.name ?? this.name,
      props.imageUrl ?? this.imageUrl,
      props.productId !== undefined ? props.productId : this.productId,
    );
  }
}
