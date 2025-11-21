// components/product/ProductGallery/ImageDisplay.tsx
"use client";

import Image from "next/image";

export default function ImageDisplay({
  src,
  alt,
  onClick,
  priority,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
  priority?: boolean;
}) {
  return (
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
}
