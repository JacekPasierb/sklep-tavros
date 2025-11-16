type Variant = {
    size: string;
    sku: string;
    stock: number;
  };

export interface InterfaceProduct  {
    _id: string;
    title: string;
    price: number;
    currency?: string;
    images?: string[];
    variants?: Variant[];
    slug?: string;
    gender?:string;
    collectionSlug?: string;
  };