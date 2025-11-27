// components/home/CollectionsTabsSection.tsx
"use client";

import { useState } from "react";
import TitleSection from "../products/TitleSection"; // albo z innej ścieżki
import type { TypeCollection } from "../../types/collection";
import CollectionsGrid from "./CollectionsGrid";


type Tab = "MENS" | "WOMENS" | "KIDS";

type Props = {
  mens: TypeCollection[];
  womens: TypeCollection[];
  kids: TypeCollection[];
};

const CollectionsTabsSection = ({ mens, womens, kids }: Props) => {
  const [active, setActive] = useState<Tab>("MENS");

  const items =
    active === "MENS" ? mens : active === "WOMENS" ? womens : kids;

  const genderLower =
    active === "MENS" ? "mens" : active === "WOMENS" ? "womens" : "kids";

  return (
    <section className="border-b border-neutral-200 bg-white">
      {/* sticky tabs pod headerem */}
      <div className="sticky top-14 z-20 bg-white/90 backdrop-blur md:top-16">
        <div className="container mx-auto px-4">
          <nav className="flex justify-center gap-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] md:gap-10 md:text-base">
            {(["MENS", "WOMENS", "KIDS"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(tab)}
                aria-pressed={active === tab}
                className={`pb-1 transition-colors ${
                  active === tab
                    ? "border-b-2 border-black text-black"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="mb-8 text-center">
          <TitleSection title="Shop by collections" />
        </div>

        <CollectionsGrid items={items} gender={genderLower} />
      </div>
    </section>
  );
};

export default CollectionsTabsSection;
