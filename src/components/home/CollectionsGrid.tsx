// components/home/CollectionsGrid.tsx
import { ShopGender } from "@/types/(shop)/product";
import { TypeCollection } from "@/types/(shop)/collections";

import TitleSection from "../products/TitleSection";
import CollectionCard, { CollectionCardProps } from "./CollectionCard";

type Props = {
  items: TypeCollection[];
  activeGender: ShopGender;
};

const CollectionsGrid = ({ items, activeGender }: Props) => {
  const cards: CollectionCardProps[] = items.map((col) => ({
    slug: col.slug,
    name: col.name,
    heroImage: col.heroImage,
    gender: activeGender, 
  }));

  return (
    <div className="container mx-auto px-4 my-[25px] md:my-[50px] lg:my-[80px]">
      <TitleSection title="Shop by Collections" />
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
          <li key={`${c.slug}-${c.gender}`} className="w-full">
            <CollectionCard {...c} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsGrid;
