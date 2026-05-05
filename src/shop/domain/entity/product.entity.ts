export type ProductCategory = 'BOTTLE' | 'MAILBOX' | 'MAIL';

export class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly imageUrl: string,
    public readonly price: number,
    public readonly category: ProductCategory,
    public readonly isActive: boolean,
  ) {}
}
