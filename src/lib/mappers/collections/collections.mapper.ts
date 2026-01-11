import {TypeCollection} from "../../../types/shop/collection";
import {ShopGender} from "../../../types/shop/productsList";

export type CollectionMongoDoc = {
  _id: {toString(): string};
  slug: string;
  name: string;
  gender: ShopGender[];
  heroImage?: string;
  sortOrder?: number;
  isFeatured?: boolean;
};

export function mapCollectionDocToCollection(
  doc: CollectionMongoDoc
): TypeCollection {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    gender: Array.isArray(doc.gender) ? doc.gender : [],
    heroImage: doc.heroImage,
    sortOrder: doc.sortOrder,
    isFeatured: doc.isFeatured ?? false,
  };
}
