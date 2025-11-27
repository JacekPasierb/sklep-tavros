// components/home/CollectionsGrid.tsx
import type { TypeCollection } from "../../types/collection";
import CollectionCard from "./CollectionCard";

type Props = {
  items: TypeCollection[];
  gender: "mens" | "womens" | "kids";
};

const CollectionsGrid = ({ items, gender }: Props) => {
  if (!items.length) {
    return (
      <p className="text-center text-sm text-neutral-500">
        Brak kolekcji dla tej kategorii.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
      {items.map((c) => (
        <li key={c._id}>
          <CollectionCard collection={c} gender={gender} />
        </li>
      ))}
    </ul>
  );
};

export default CollectionsGrid;
