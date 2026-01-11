import { ShopGender } from "./productsList";


export type TypeCollection = {
  _id: string;
  slug: string;
  name: string;
  gender: ShopGender[];
  heroImage?: string;
  sortOrder?: number;
  isFeatured: boolean;
};
 