// components/home/HomeCollectionsSection.tsx
"use client";

import { useState } from "react";
import type { TypeCollection, Gender } from "../../types/collection";
import CollectionsGrid from "./CollectionsGrid";
import type { CollectionCardProps } from "./CollectionCard";
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

  const itemsForGrid: CollectionCardProps[] = collections.map((c) => ({
    slug: c.slug,
    name: c.name,
    heroImage: c.heroImage,
    // bierzemy pierwszy gender z tablicy jako „główny”
    gender: (c.gender[0] ?? activeGender) as Gender,
  }));

  return (
    <section className="w-full">
      <GenderTabs active={activeGender} onChange={setActiveGender} />
      <CollectionsGrid items={itemsForGrid} />
    </section>
  );
};

export default HomeCollectionsSection;
