import React from "react";

const EmptyState = ({path}: {path: string}) => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-2xl   px-6 py-12 text-center">
      {/* Prosta ikonka „pusta półka” */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        aria-hidden="true"
        className="mb-6 text-neutral-400"
      >
        <rect
          x="8"
          y="28"
          width="64"
          height="32"
          rx="6"
          className="fill-none stroke-current"
          strokeWidth="2"
        />
        <path
          d="M8 36h64"
          className="fill-none stroke-current"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="46"
          r="4"
          className="fill-none stroke-current"
          strokeWidth="2"
        />
        <circle
          cx="40"
          cy="46"
          r="4"
          className="fill-none stroke-current"
          strokeWidth="2"
        />
        <circle
          cx="56"
          cy="46"
          r="4"
          className="fill-none stroke-current"
          strokeWidth="2"
        />
        <path
          d="M16 20h48"
          className="fill-none stroke-current"
          strokeWidth="2"
        />
      </svg>

      <h2 className="mb-2 text-lg font-semibold text-neutral-900">
        Brak produktów spełniających kryteria
      </h2>
      <p className="mb-6 max-w-md text-sm text-neutral-600">
        Spróbuj zmienić rozmiar, kolor lub inne filtry. Możesz też wyczyścić
        wszystkie filtry i zobaczyć całą kolekcję.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={path}
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          Wyczyść filtry
        </a>
      </div>
    </div>
  );
};

export default EmptyState;
