"use client";

import {useState} from "react";

import type {TypeCollection} from "@/types/(shop)/collections";

import CollectionsGrid from "./CollectionsGrid";
import Slider from "../products/Slider";
import GenderTabs from "./GendersTab";
import {ShopGender, TypeProduct} from "@/types/(shop)/product";

type Props = {
  collectionsByGender: Record<ShopGender, TypeCollection[]>;
  bestsellersByGender: Record<ShopGender, TypeProduct[]>;
};

const HomeGenderSection = ({
  collectionsByGender,
  bestsellersByGender,
}: Props) => {
  const [active, setActive] = useState<ShopGender>("mens");

  const collections = collectionsByGender[active] ?? [];
  const bestsellers = bestsellersByGender[active] ?? [];

  return (
    <section className="w-full">
      <GenderTabs active={active} onChange={setActive} />
      <CollectionsGrid items={collections} activeGender={active} />

      {/* Slider bestseller dla aktywnego taba */}
      {bestsellers.length > 0 && (
        <div className="mt-10">
          <Slider
            products={bestsellers}
            title="Best Sellers"
            showCollectionLink={false}
          />
        </div>
      )}
    </section>
  );
};

export default HomeGenderSection;
