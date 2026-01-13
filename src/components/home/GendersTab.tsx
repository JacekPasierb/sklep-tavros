// components/home/GenderTabs.tsx
"use client";

import {ShopGender} from "@/types/(shop)/product";

type Props = {
  active: ShopGender;
  onChange: (tab: ShopGender) => void;
};

const LABELS: Record<ShopGender, string> = {
  mens: "MENS",
  womens: "WOMENS",
  kids: "KIDS",
};

const GenderTabs = ({active, onChange}: Props) => {
  const tabs: ShopGender[] = ["mens", "womens", "kids"];

  return (
    <div className="sticky top-14 z-30 border-b bg-white/90 backdrop-blur md:top-16">
      <div className="container mx-auto py-4">
        <ul className="flex justify-center gap-6 py-3 text-sm font-semibold uppercase md:gap-8 md:text-base lg:text-lg">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                type="button"
                onClick={() => onChange(tab)}
                className={`cursor-pointer pb-1 transition-colors ${
                  active === tab
                    ? "border-b-2 border-black text-black"
                    : "text-zinc-500 hover:text-black"
                }`}
                aria-pressed={active === tab}
              >
                {LABELS[tab]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenderTabs;
