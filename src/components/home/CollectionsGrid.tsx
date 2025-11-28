// components/home/CollectionsGrid.tsx
import TitleSection from "../products/TitleSection";
import CollectionCard, { CollectionCardProps } from "./CollectionCard";

type Props = {
  items: CollectionCardProps[];
};

const CollectionsGrid = ({ items }: Props) => {
  if (!items.length) return null;

  return (
    <div className="container mx-auto px-4 my-[25px] md:my-[50px] lg:my-[80px]">
      <TitleSection title="Shop by Collections" />
      <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((c) => (
          <li key={`${c.gender}-${c.slug}`} className="w-full">
            <CollectionCard {...c} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsGrid;
