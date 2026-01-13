// components/product/ProductGallery/SliderDots.tsx
"use client";

const SliderDots=({
  length,
  active,
  onSelect,
}: {
  length: number;
  active: number;
  onSelect: (i: number) => void;
}) =>{
  return (
    <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`h-2 w-2 rounded-full transition 
          ${i === active ? "bg-black" : "bg-black/30 hover:bg-black/50"}`}
        />
      ))}
    </div>
  );
}
export default SliderDots;