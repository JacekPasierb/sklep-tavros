// components/product/ProductGallery/NavButton.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const NavButton=({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled?: boolean;
  onClick: (e?: React.MouseEvent) => void;
})=> {
  return (
    <button
      onClick={(e) => onClick(e)}
      disabled={disabled}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={`absolute top-1/2 z-10 -translate-y-1/2 bg-white/80 
      backdrop-blur rounded-full p-2 shadow hover:bg-white disabled:opacity-40 
      ${side === "left" ? "left-2" : "right-2"}`}
    >
      {side === "left" ? (
        <ChevronLeft className="h-6 w-6" />
      ) : (
        <ChevronRight className="h-6 w-6" />
      )}
    </button>
  );
}
export default NavButton;