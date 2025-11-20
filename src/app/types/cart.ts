export type CartItem = {
    _id: string;
    title: string;
    price: number;
    image?: string;
    images?: string[]; 
    heroImage?: string; 
    qty: number;
    slug: string;
    size?: string;
    sku?: string;
  };