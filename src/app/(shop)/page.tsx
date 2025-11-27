import BannerSection from "../../components/home/BannerSection";
import CollectionsTabsSection from "../../components/home/CollectionsTagsSection";
import { getCollections } from "../../lib/collections";

const Home = async() => {
  const collections = await getCollections();
console.log("kolekcja",collections);

  const mens = collections.filter((c) => c.gender.includes("mens"));
  const womens = collections.filter((c) => c.gender.includes("womens"));
  const kids = collections.filter((c) => c.gender.includes("kids"));
  return (
    <>
      <BannerSection />
      <CollectionsTabsSection mens={mens} womens={womens} kids={kids} />
    </>
  );
};

export default Home;
