export type Gender = "mens" | "womens" | "kids" | "unisex";

export type TypeCollection = {
  _id: string;
  slug: string;
  name: string;
  gender: Gender[];
  heroImage?: string;
  sortOrder?: number;
  isFeatured: boolean;
};
