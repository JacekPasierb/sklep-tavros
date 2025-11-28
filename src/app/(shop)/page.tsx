import BannerSection from "../../components/home/BannerSection";
import HomeCollectionsSection from "../../components/home/HomeCollectionsSection";
import {getCollections} from "../../lib/collections";

const Home = async () => {
  // const collections = await getCollections();
  const [mens, womens, kids] = await Promise.all([
    getCollections({gender: "mens"}),
    getCollections({gender: "womens"}),
    getCollections({gender: "kids"}),
  ]);

  // const mens = collections.filter((c) => c.gender.includes("mens"));
  // const womens = collections.filter((c) => c.gender.includes("womens"));
  // const kids = collections.filter((c) => c.gender.includes("kids"));
  return (
    <>
      <BannerSection />
      {/* <CollectionsTabsSection mens={mens} womens={womens} kids={kids} /> */}
      <HomeCollectionsSection initialCollections={{mens, womens, kids}} />
    </>
  );
};

export default Home;
