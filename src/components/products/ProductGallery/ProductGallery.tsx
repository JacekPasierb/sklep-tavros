"use client";

import Image from "next/image";
import {useMemo, useRef, useState, type ReactNode} from "react";
import {X} from "lucide-react";

import {getSafeSrc} from "./getSafeSrc";
import {useGallery} from "./useGallery";
import {useLightbox} from "./useLightBox";
import NavButton from "./NavButton";
import SliderDots from "./SliderDots";
import Thumb from "./Thumb";
import ImageDisplay from "./ImageDisplay";

type Props = {
  images?: string[];
  title?: string;
  overlay?: ReactNode;
};

const ProductGallery = ({images = [], title = "Product", overlay}: Props) => {
  const safe = useMemo(() => {
    const srcs = images.filter(Boolean);
    return srcs.length ? srcs.map(getSafeSrc) : ["/placeholder.png"];
  }, [images]);
  const {index, next, prev, setIndex} = useGallery(safe.length);

  const [open, setOpen] = useState(false);
  const openLightbox = () => setOpen(true);
  const closeLightbox = () => setOpen(false);

  useLightbox(open, closeLightbox, prev, next);

  // swipe in lightbox
  const startX = useRef<number | null>(null);
  const onStart = (e: React.TouchEvent) =>
    (startX.current = e.touches[0].clientX);
  const onEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    startX.current = null;
  };

  return (
    <>
      {/* MOBILE slider */}
      <div className="relative md:hidden">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== index) setIndex(i);
          }}
        >
          {safe.map((src, i) => (
            <div
              key={i}
              className="relative w-full aspect-square shrink-0 snap-start bg-gray-100"
            >
              <ImageDisplay
                src={src}
                alt={`${title} ${i + 1}`}
                onClick={openLightbox}
                priority={i === 0}
              />

              {overlay && (
                <div className="absolute inset-0 pointer-events-none">
                  {overlay}
                </div>
              )}
            </div>
          ))}
        </div>

        {safe.length > 1 && (
          <>
            <NavButton side="left" disabled={index === 0} onClick={prev} />
            <NavButton
              side="right"
              disabled={index === safe.length - 1}
              onClick={next}
            />
            <SliderDots
              length={safe.length}
              active={index}
              onSelect={setIndex}
            />
          </>
        )}
      </div>

      {/* TABLET */}
      <div className="hidden md:flex md:flex-col gap-4 lg:hidden">
        <div className="relative h-[70vh] bg-gray-100">
          <ImageDisplay
            src={safe[index]}
            alt={`${title} ${index + 1}`}
            onClick={openLightbox}
            priority
          />
        </div>

        {safe.length > 1 && (
          <ul className="grid grid-cols-5 gap-2">
            {safe.map((src, i) => (
              <Thumb
                key={i}
                src={src}
                index={i}
                title={title}
                active={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:grid grid-cols-[120px_1fr] gap-3">
        {safe.length > 1 && (
          <ul className="h-[80vh] overflow-y-auto space-y-3 pr-1 no-scrollbar">
            {safe.map((src, i) => (
              <Thumb
                key={i}
                src={src}
                index={i}
                title={title}
                active={i === index}
                onClick={() => setIndex(i)}
              />
            ))}
          </ul>
        )}

        <div className="relative h-[80vh] bg-gray-100 shadow">
          <ImageDisplay
            src={safe[index]}
            alt={`${title} ${index + 1}`}
            onClick={openLightbox}
            priority
          />

          {overlay && (
            <div className="absolute inset-0 pointer-events-none">
              {overlay}
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX */}
      {open && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={onStart}
          onTouchEnd={onEnd}
        >
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full backdrop-blur hover:bg-white/30 text-white"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative w-[90vw] h-[90vh] max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={safe[index]}
              alt={`${title} ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {safe.length > 1 && (
            <>
              <NavButton
                side="left"
                disabled={index === 0}
                onClick={(e) => {
                  e?.stopPropagation();
                  prev();
                }}
              />
              <NavButton
                side="right"
                disabled={index === safe.length - 1}
                onClick={(e) => {
                  e?.stopPropagation();
                  next();
                }}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProductGallery;
