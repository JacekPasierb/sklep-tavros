"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ProductCard from "./ProductCard";
import TitleSection from "./TitleSection";
import { TypeProduct } from "../../types/(shop)/product";


type Props = {
  products: TypeProduct[];
  title: string;
  showCollectionLink?: boolean;
};

const AUTO_SCROLL_MS = 2500;

export default function Slider({
  products,
  title,
  showCollectionLink = true,
}: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [isHover, setIsHover] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ HOOKI NA GÓRZE, ale jeśli brak produktów, to i tak nic nie renderujemy
  const hasProducts = products.length > 0;

  const collectionLink = useMemo(() => {
    if (!hasProducts) return null;

    const first = products[0];
    const gender = first.gender?.toLowerCase() ?? "mens";
    const collectionSlug = first.collectionSlug ?? null;

    if (!collectionSlug) return null;

    return {
      href: `/${gender}/collection/${collectionSlug}`,
      label: "View Collection",
    };
  }, [hasProducts, products]);

  const getItems = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return null;

    const items = slider.querySelectorAll<HTMLElement>("[data-slider-item]");
    if (!items.length) return null;

    return { slider, items };
  }, []);

  const scrollToIndex = useCallback(
    (nextIndex: number) => {
      const data = getItems();
      if (!data) return;

      const { slider, items } = data;

      const normalized =
        ((nextIndex % items.length) + items.length) % items.length;

      const targetLeft = items[normalized].offsetLeft;

      slider.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });

      setCurrentIndex(normalized);
    },
    [getItems]
  );

  const scrollLeft = useCallback(() => {
    scrollToIndex(currentIndex - 1);
  }, [currentIndex, scrollToIndex]);

  const scrollRight = useCallback(() => {
    scrollToIndex(currentIndex + 1);
  }, [currentIndex, scrollToIndex]);

  // --- AUTO SCROLL (loop) ---
  useEffect(() => {
    if (!hasProducts) return;
    if (isHover) return;

    const data = getItems();
    if (!data) return;

    const { items } = data;
    if (items.length <= 1) return;

    const id = window.setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % items.length;
        // przewiń “zgodnie z indeksem”
        scrollToIndex(next);
        return next;
      });
    }, AUTO_SCROLL_MS);

    return () => window.clearInterval(id);
  }, [hasProducts, isHover, getItems, scrollToIndex]);

  // EARLY RETURN PO HOOKACH ✅
  if (!hasProducts) return null;

  return (
    <div className="bg-white">
      <section className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-6 text-center">
          <TitleSection title={title} />
        </div>

        {/* Slider wrapper */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {/* LEFT */}
          <button
            type="button"
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 
              bg-black/70 hover:bg-black text-white p-3 rounded-full opacity-0 
              group-hover:opacity-100 transition"
            aria-label="Previous"
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="snap-start shrink-0 w-[260px] sm:w-[300px] lg:w-[320px]"
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>

          {/* RIGHT */}
          <button
            type="button"
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 
              bg-black/70 hover:bg-black text-white p-3 rounded-full opacity-0 
              group-hover:opacity-100 transition"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Collection link */}
        {collectionLink && showCollectionLink && (
          <div className="mt-8 flex justify-center">
            <Link
              href={collectionLink.href}
              className="inline-flex items-center bg-black text-white px-6 py-2.5 
                font-medium hover:bg-black/90 transition text-sm tracking-wide"
            >
              {collectionLink.label}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
