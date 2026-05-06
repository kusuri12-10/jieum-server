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

  static create(props: {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    category: ProductCategory;
  }): Product {
    return new Product(
      0,
      props.name,
      props.description,
      props.imageUrl,
      props.price,
      props.category,
      true,
    );
  }

  deactivate(): Product {
    return new Product(
      this.id,
      this.name,
      this.description,
      this.imageUrl,
      this.price,
      this.category,
      false,
    );
  }

  update(props: {
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
  }): Product {
    return new Product(
      this.id,
      props.name ?? this.name,
      props.description ?? this.description,
      props.imageUrl ?? this.imageUrl,
      props.price ?? this.price,
      this.category,
      this.isActive,
    );
  }
}
