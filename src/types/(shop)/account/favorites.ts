export type FavoriteProduct = {
    _id: string;
    slug: string;
    title: string;
    price: number;
    currency?: string;
    images?: string[];
    collectionSlug?: string;
  };
  
  export type FavoritesResponse = {
    ok: boolean;
    data: FavoriteProduct[];
    count: number;
  };