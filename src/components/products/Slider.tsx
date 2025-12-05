"use client";

import {motion} from "framer-motion";
import {ChevronLeft, ChevronRight} from "lucide-react";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";

import ProductCard from "./ProductCard";
import TitleSection from "./TitleSection";
import {TypeProduct} from "../../types/product";

type Props = {
  products: TypeProduct[];
  title: string;
  showCollectionLink?: boolean; 
};

export default function Slider({products, title, showCollectionLink = true}: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- AUTO SCROLL (Nike style, z loopem) ---
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || isHover || products.length === 0) return;

    const items = slider.querySelectorAll<HTMLElement>("[data-slider-item]");
    if (!items.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % items.length; // loop
        const target = items[next].offsetLeft;

        slider.scrollTo({
          left: target,
          behavior: "smooth",
        });

        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isHover, products.length]);

  // 🟢 HOOKI SĄ JUŻ WYWOŁANE – TERAZ MOŻEMY ZROBIĆ EARLY RETURN
  if (!products.length) {
    return null;
  }

  const first = products[0];
  const gender = first.gender?.toLowerCase() ?? "mens";
  const collectionSlug = first.collectionSlug ?? null;

  // pomocnicza funkcja do przewijania na konkretny index
  const scrollToIndex = (nextIndex: number) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const items = slider.querySelectorAll<HTMLElement>("[data-slider-item]");
    if (!items.length) return;

    const normalized =
      ((nextIndex % items.length) + items.length) % items.length; // bezpieczne modulo
    const target = items[normalized].offsetLeft;

    slider.scrollTo({
      left: target,
      behavior: "smooth",
    });

    setCurrentIndex(normalized);
  };

  // --- NAV BUTTONS ---
  const scrollLeft = () => scrollToIndex(currentIndex - 1);
  const scrollRight = () => scrollToIndex(currentIndex + 1);

  return (
    <div className="bg-white">
      <section className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Tytuł */}
        <div className="mb-6 text-center">
          <TitleSection title={title} />
        </div>

        {/* Slider wrapper */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {/* LEFT BUTTON */}
          <button
            type="button"
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 
              bg-black/70 hover:bg-black text-white p-3 rounded-full opacity-0 
              group-hover:opacity-100 transition"
          >
            <ChevronLeft size={22} />
          </button>

          {/* TRACK */}
          <div
            ref={sliderRef}
            className="
              flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory 
              scroll-smooth px-1
            "
          >
            {products.map((p, i) => (
              <motion.div
                key={p._id}
                data-slider-item
                initial={{opacity: 0, y: 15}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.35, delay: i * 0.05}}
                className="
                  snap-start shrink-0 w-[260px] 
                  sm:w-[300px] lg:w-[320px]
                "
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>

          {/* RIGHT BUTTON */}
          <button
            type="button"
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 
              bg-black/70 hover:bg-black text-white p-3 rounded-full opacity-0 
              group-hover:opacity-100 transition"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Link do kolekcji */}
        {collectionSlug && showCollectionLink && (
          <div className="mt-8 flex justify-center">
            <Link
              href={`/${gender}/collection/${collectionSlug}`}
              className="inline-flex items-center bg-black text-white px-6 py-2.5 
                font-medium hover:bg-black/90 transition text-sm tracking-wide"
            >
              View Collection
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
