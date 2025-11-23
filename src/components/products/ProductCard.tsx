// Nowy
// components/products/ProductCard.tsx

import Link from "next/link";
import Image from "next/image";
import {TypeProduct} from "../../types/product";

type Props = {
  product: TypeProduct;
};

const ProductCard = ({product}: Props) => {
  const firstImg = product.images?.[0] ?? "/placeholder.png";
  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <article className="group overflow-hidden bg-transparent transition">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
          <Image
            src={firstImg}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>

        <div className="flex items-start justify-between py-3 px-2">
          <div>
            <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
              {product.title}
            </h3>
            <p className="text-sm text-neutral-700">
              {Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(product.price)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
