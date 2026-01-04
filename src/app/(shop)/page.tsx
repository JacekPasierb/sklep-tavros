// app/(shop)/page.tsx

import BannerSection from "../../components/home/BannerSection";
import HomeGenderSection from "../../components/home/HomeGenderSection";
import {getCollections} from "../../lib/collections";
import { getProducts } from "../../lib/services/shop/products.service";


export default async function HomePage() {
  // 1. Kolekcje dla wszystkich płci
  const [mensCollections, womensCollections, kidsCollections] =
    await Promise.all([
      getCollections({gender: "mens"}),
      getCollections({gender: "womens"}),
      getCollections({gender: "kids"}),
    ]);

  // 2. Bestsellery dla wszystkich płci
  const [mensBest, womensBest, kidsBest] = await Promise.all([
    getProducts({gender: "mens", mode: "bestseller", limit: 8}),
    getProducts({gender: "womens", mode: "bestseller", limit: 8}),
    getProducts({gender: "kids", mode: "bestseller", limit: 8}),
  ]);

  return (
    <>
      <BannerSection />
      <HomeGenderSection
        collectionsByGender={{
          mens: mensCollections,
          womens: womensCollections,
          kids: kidsCollections,
        }}
        bestsellersByGender={{
          mens: mensBest.items,
          womens: womensBest.items,
          kids: kidsBest.items,
        }}
      />
    </>
  );
}
