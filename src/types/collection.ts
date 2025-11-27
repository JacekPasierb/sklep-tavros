export type Gender = "mens" | "womens" | "kids" | "unisex";

export type TypeCollection = {
  _id: string;
  name: string;
  slug: string;
  gender: Gender;
  heroImage?: string;
  sortOrder?: number;
  isFeatured: boolean;
};
