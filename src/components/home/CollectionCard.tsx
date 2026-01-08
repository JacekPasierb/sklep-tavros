// components/home/CollectionCard.tsx
import Image from "next/image";
import Link from "next/link";
import { ShopGender } from "../../types/shop/productsList";


export type CollectionCardProps = {
  slug: string;
  name: string;
  heroImage?: string;
  gender: ShopGender; 
};

const CollectionCard = ({
  slug,
  name,
  heroImage,
  gender,
}: CollectionCardProps) => {
  const href = `/${gender}/collection/${slug}`;

  return (
    <Link href={href} className="block w-full group">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100">
        {heroImage && (
          <Image
            src={heroImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* pełny overlay z tekstem pośrodku */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
          <span
            className="
              px-2 text-center
              text-sm sm:text-base md:text-lg
              font-extrabold tracking-[0.18em]
              text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]
              uppercase
            "
          >
            {name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;
