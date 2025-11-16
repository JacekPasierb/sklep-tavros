"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {ChevronLeft, ChevronRight, X} from "lucide-react";

// ---------- utils ----------
const getSafeSrc = (src?: string | null) =>
  typeof src === "string" && src.trim()
    ? src
    : "/placeholder.png";

// ---------- hook: gallery state ----------
function useGallery(length: number) {
  const [index, setIndex] = useState(0);

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(length - 1, i)),
    [length]
  );

  return {
    index,
    setIndex: (i: number) => setIndex(clamp(i)),
    next: () => setIndex((i) => clamp(i + 1)),
    prev: () => setIndex((i) => clamp(i - 1)),
    clamp,
  };
}

// ---------- hook: lightbox ----------
function useLightbox(
  isOpen: boolean,
  close: () => void,
  onLeft: () => void,
  onRight: () => void
) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") onLeft();
      if (e.key === "ArrowRight") onRight();
    };

    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close, onLeft, onRight]);
}

// ---------- subcomponents ----------
const NavButton = ({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled?: boolean;
  onClick: (e?: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={side === "left" ? "Previous image" : "Next image"}
    className={`absolute top-1/2 z-10 -translate-y-1/2 bg-white/80 backdrop-blur 
    rounded-full p-2 shadow hover:bg-white disabled:opacity-40 
    ${side === "left" ? "left-2" : "right-2"}`}
  >
    {side === "left" ? (
      <ChevronLeft className="h-6 w-6" />
    ) : (
      <ChevronRight className="h-6 w-6" />
    )}
  </button>
);

const SliderDots = ({
  length,
  active,
  onSelect,
}: {
  length: number;
  active: number;
  onSelect: (i: number) => void;
}) => (
  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
    {Array.from({length}).map((_, i) => (
      <button
        key={i}
        aria-label={`Go to image ${i + 1}`}
        onClick={() => onSelect(i)}
        className={`h-2 w-2 rounded-full transition
          ${i === active ? "bg-black" : "bg-black/30 hover:bg-black/50"}`}
      />
    ))}
  </div>
);

const Thumb = ({
  src,
  active,
  onClick,
  index,
  title,
}: {
  src: string;
  index: number;
  active: boolean;
  title: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    aria-label={`Show image ${index + 1}`}
    className={`relative w-full overflow-hidden aspect-square border-2 transition 
      ${active ? "border-black" : "border-transparent hover:border-black/40"}`}
  >
    <Image
      src={src}
      alt={`${title} thumb ${index + 1}`}
      fill
      sizes="20vw"
      className="object-cover"
    />
  </button>
);

const ImageDisplay = ({
  src,
  alt,
  onClick,
  priority,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
  priority?: boolean;
}) => (
  <Image
    src={src}
    alt={alt}
    fill
    priority={priority}
    className={`object-cover ${onClick ? "cursor-zoom-in" : ""}`}
    sizes="100vw"
    onClick={onClick}
  />
);

// ---------- MAIN COMPONENT ----------
type Props = {
  images?: string[];
  title?: string;
  overlay?: ReactNode;
};

export default function ProductGallery({
  images = [],
  title = "Product",
  overlay,
}: Props) {
  const safe = useMemo(
    () => (images.length ? images.map(getSafeSrc) : ["/placeholder.png"]),
    [images]
  );

  const gallery = useGallery(safe.length);
  const {index, next, prev, setIndex} = gallery;

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
            <div key={i} className="relative w-full aspect-square shrink-0 snap-start bg-gray-100">
              <ImageDisplay
                src={src}
                alt={`${title} ${i + 1}`}
                onClick={openLightbox}
                priority={i === 0}
              />
              {overlay && <div className="absolute top-2 right-2">{overlay}</div>}
            </div>
          ))}
        </div>

        {safe.length > 1 && (
          <>
            <NavButton side="left" disabled={index === 0} onClick={prev} />
            <NavButton side="right" disabled={index === safe.length - 1} onClick={next} />
            <SliderDots length={safe.length} active={index} onSelect={setIndex} />
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
          {overlay && <div className="absolute top-4 right-4">{overlay}</div>}
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
              <NavButton side="left" disabled={index === 0} onClick={(e) => { e?.stopPropagation(); prev(); }} />
              <NavButton side="right" disabled={index === safe.length - 1} onClick={(e) => { e?.stopPropagation(); next(); }} />
            </>
          )}
        </div>
      )}
    </>
  );
}
