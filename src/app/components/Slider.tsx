"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";

import {motion} from "framer-motion";
import type {Product as CardProduct} from "./ProductCard";
import TitleSection from "./TitleSection";

type ProductWithGender = {
  _id: string;
  gender?: string;
};

const Slider = ({
  products,
  product,
  collectionSlug,
  title,
}: {
  products: Array<CardProduct>;
  product?: ProductWithGender;
  collectionSlug?: string;
  title: string;
}) => {
  return (
    <div className="bg-[#f6f6f6]">
      <section className=" container mx-auto py-6 px-4 flex flex-col items-center sm:px-6 lg:px-8">
        <div className="mb-6 w-full text-center">
          <TitleSection title={title} />
        </div>

        {/* SLIDER */}
        <div
          className="
  w-full max-w-[1200px]
  overflow-x-auto no-scrollbar
  flex gap-4 snap-x snap-mandatory
  px-4
  min-[1000px]:grid min-[1000px]:grid-cols-3 min-[1000px]:gap-6
  min-[1000px]:overflow-visible min-[1000px]:px-0
"
        >
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.35, delay: i * 0.06}}
              className="
      snap-start shrink-0
      w-[260px]   /* stabilna szerokość kafelka na mobile */
      min-[380px]:w-72
      min-[1000px]:w-auto min-[1000px]:shrink
    "
            >
              <ProductCard product={p} showHeart />
            </motion.div>
          ))}
        </div>

        {title !== "Best Sellers" && (
          <div className="mt-6 flex justify-center w-full">
            <Link
              href={
                product && collectionSlug
                  ? `/collections/${product.gender}/${collectionSlug}`
                  : "#"
              }
              prefetch={false}
              className="inline-flex items-center  bg-black px-5 py-2 text-white text-sm font-medium hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              View collection
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Slider;
