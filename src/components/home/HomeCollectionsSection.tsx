// components/home/HomeCollectionsSection.tsx
"use client";

import { useState } from "react";
import type { TypeCollection, Gender } from "../../types/collection";
import CollectionsGrid from "./CollectionsGrid";
import GenderTabs from "./GendersTab";

type GenderTab = "mens" | "womens" | "kids";

type Props = {
  initialCollections: {
    mens: TypeCollection[];
    womens: TypeCollection[];
    kids: TypeCollection[];
  };
};

const HomeCollectionsSection = ({ initialCollections }: Props) => {
  const [activeGender, setActiveGender] = useState<GenderTab>("mens");

  const collections = initialCollections[activeGender] ?? [];

  return (
    <section className="w-full">
      <GenderTabs active={activeGender} onChange={setActiveGender} />
      <CollectionsGrid
        items={collections}
        activeGender={activeGender as Extract<Gender, "mens" | "womens" | "kids">}
      />
    </section>
  );
};

export default HomeCollectionsSection;
