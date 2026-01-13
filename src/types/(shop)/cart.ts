// types/cart.ts
import { Types } from "mongoose";

export type CartEntry = {
  product: Types.ObjectId; 
  qty: number;
  size?: string;
  color?: string;
  sku?: string;
};

export type CartItem = {
  key: string;          // np. productId__size__color__sku – do PATCH/DELETE
  productId: string;   
  slug: string;

  title: string;
  price: number;
  currency?: string;

  image?: string;
  images?: string[];
  heroImage?: string;

  qty: number;
  size?: string;
  color?: string;
  sku?: string;
};

