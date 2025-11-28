// components/home/GenderTabs.tsx
"use client";

type GenderTab = "mens" | "womens" | "kids";

type Props = {
  active: GenderTab;
  onChange: (g: GenderTab) => void;
};

const LABELS: Record<GenderTab, string> = {
  mens: "MENS",
  womens: "WOMENS",
  kids: "KIDS",
};

const GenderTabs = ({ active, onChange }: Props) => {
  return (
    <div className="sticky top-14 z-30 border-b bg-white/90 backdrop-blur md:top-18">
      <div className="container mx-auto py-4">
        <ul className="flex justify-center gap-6 py-3 text-lg font-semibold uppercase md:gap-8 lg:text-[25px]">
          {(["mens", "womens", "kids"] as const).map((g) => (
            <li key={g}>
              <button
                onClick={() => onChange(g)}
                className={`cursor-pointer border-b-2 pb-1 transition-colors ${
                  active === g
                    ? "border-black text-black"
                    : "border-transparent text-zinc-500 hover:text-black"
                }`}
                aria-pressed={active === g}
              >
                {LABELS[g]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenderTabs;
