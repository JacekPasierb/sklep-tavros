import { ProductGender } from "./product";


export type TypeCollection = {
  _id: string;
  slug: string;
  name: string;
  gender: ProductGender[];
  heroImage?: string;
  sortOrder?: number;
  isFeatured: boolean;
};
 