// components/product/ProductGallery/Thumb.tsx
"use client";

import Image from "next/image";

export default function Thumb({
  src,
  index,
  title,
  active,
  onClick,
}: {
  src: string;
  index: number;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full overflow-hidden aspect-square border-2 
      transition ${active ? "border-black" : "border-transparent hover:border-black/40"}`}
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
}
