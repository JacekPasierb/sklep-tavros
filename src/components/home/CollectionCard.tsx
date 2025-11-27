// components/home/CollectionCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { TypeCollection } from "../../types/collection";

type Props = {
  collection: TypeCollection;
  gender: "mens" | "womens" | "kids";
};

const CollectionCard = ({ collection, gender }: Props) => {
  const href = `/${gender}/collection/${collection.slug}`;
  const img = collection.heroImage ?? "/placeholder-collection.webp";

  return (
    <Link href={href} className="group block w-full">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <Image
          src={img}
          alt={collection.name}
          fill
          sizes="(min-width: 1024px) 20vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* overlay z nazwą */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/55 via-black/5 to-transparent">
          <span className="mb-4 px-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white md:text-xs">
            {collection.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;
