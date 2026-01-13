import { ShopGender } from "./product";

export type CollectionItem = { label: string; href: string; img?: string };
export type CollectionsResponse = { items: CollectionItem[] };


export type TypeCollection = {
  _id: string;
  slug: string;
  name: string;
  gender: ShopGender[];
  heroImage?: string;
  sortOrder?: number;
  isFeatured: boolean;
};
 