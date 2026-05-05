export class Purchase {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly productId: number,
    public readonly purchasedAt: Date,
  ) {}

  static create(userId: number, productId: number): Purchase {
    return new Purchase(0, userId, productId, new Date());
  }
}
