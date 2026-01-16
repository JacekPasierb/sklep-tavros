// app/(shop)/page.tsx

import BannerSection from "@/components/home/BannerSection";
import HomeGenderSection from "@/components/home/HomeGenderSection";
import {getCollections} from "@/lib/services/(shop)/collections/collections.service";
import {getProducts} from "@/lib/services/(shop)/products/products.service";

const HomePage = async () => {
  const [mensCollections, mensBest] = await Promise.all([
    getCollections({ gender: "mens" }),
    getProducts({ gender: "mens", mode: "bestseller", limit: 8 }),
  ]);
  // const [mensCollections, womensCollections, kidsCollections] =
  //   await Promise.all([
  //     getCollections({gender: "mens"}),
  //     getCollections({gender: "womens"}),
  //     getCollections({gender: "kids"}),
  //   ]);

  // const [mensBest, womensBest, kidsBest] = await Promise.all([
  //   getProducts({gender: "mens", mode: "bestseller", limit: 8}),
  //   getProducts({gender: "womens", mode: "bestseller", limit: 8}),
  //   getProducts({gender: "kids", mode: "bestseller", limit: 8}),
  // ]);

  return (
    <>
      <BannerSection />
      <HomeGenderSection
        collectionsByGender={{
          mens: mensCollections,
          womens: [],
          kids: [],
        }}
        bestsellersByGender={{
          mens: mensBest.items,
          womens: [],
          kids: [],
        }}
      />
      {/* <HomeGenderSection
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
      /> */}
    </>
  );
};
export default HomePage;
