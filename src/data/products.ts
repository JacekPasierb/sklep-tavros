// src/data/products.ts
export type Product = {
    id: string;
    slug: string;
    name: string;
    price: number;
    gender: "mens" | "womens";
    collectionSlug?: string;
    isBestseller?: boolean;
    imageUrl: string;
  };
  
  export const products: Product[] = [
    {
      id: "1",
      slug: "lux-gold-42",
      name: "Lux Gold 42mm",
      price: 5999,
      gender: "mens",
      collectionSlug: "christmas",
      isBestseller: true,
      imageUrl: "/images/products/lux-gold-42.jpg",
    },
    {
      id: "2",
      slug: "silver-elegance",
      name: "Silver Elegance",
      price: 3999,
      gender: "womens",
      collectionSlug: "classic",
      isBestseller: false,
      imageUrl: "/images/products/silver-elegance.jpg",
    },
    // ...
  ];
  