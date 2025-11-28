"use client";

import {useState} from "react";
import type {Gender} from "../../types/collection";
import type {TypeCollection} from "../../types/collection";
import type {TypeProduct} from "../../types/product";

import CollectionsGrid from "./CollectionsGrid";
import Slider from "../products/Slider";
import GenderTabs from "./GendersTab";

type GenderTab = Extract<Gender, "mens" | "womens" | "kids">;

type Props = {
  collectionsByGender: Record<GenderTab, TypeCollection[]>;
  bestsellersByGender: Record<GenderTab, TypeProduct[]>;
};

const HomeGenderSection = ({
  collectionsByGender,
  bestsellersByGender,
}: Props) => {
  const [active, setActive] = useState<GenderTab>("mens");

  const collections = collectionsByGender[active] ?? [];
  const bestsellers = bestsellersByGender[active] ?? [];

  return (
    <section className="w-full">
      {/* Tabs MENS / WOMENS / KIDS */}
      <GenderTabs active={active} onChange={setActive} />

      {/* Grid kolekcji */}
      <CollectionsGrid items={collections} activeGender={active} />

      {/* Slider bestseller dla aktywnego taba */}
      {bestsellers.length > 0 && (
        <div className="mt-10">
          <Slider products={bestsellers} title="Best Sellers" showCollectionLink={false}/>
        </div>
      )}
    </section>
  );
};

export default HomeGenderSection;
