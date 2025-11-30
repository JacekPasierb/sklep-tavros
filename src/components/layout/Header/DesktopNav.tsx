// components/layout/Header/DesktopNav.tsx
"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

type GenderTab = "mens" | "womens" | "kids";

const tabs: {id: GenderTab; label: string}[] = [
  {id: "mens", label: "MENS"},
  {id: "womens", label: "WOMENS"},
  {id: "kids", label: "KIDS"},
];

function getSubLinks(gender: GenderTab) {
  return [
    {label: "NEW IN", href: `/${gender}/new`},
    {label: "SHOP ALL", href: `/${gender}/all`},
    {label: "BEST SELLER", href: `/${gender}/bestseller`},
    {label: "SALE", href: `/${gender}/sale`},
  ];
}

export default function DesktopNav() {
  const pathname = usePathname();

  const isActive = (gender: GenderTab) => pathname.startsWith(`/${gender}/`);

  return (
    <nav className="relative hidden items-center justify-center gap-8 lg:flex">
      <ul className="flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.18em]">
        {tabs.map((tab) => (
          <li key={tab.id} className="relative group">
            {/* Główny tab */}
            <Link
              href={`/${tab.id}/all`}
              className={`
    relative pb-1 text-xs font-semibold uppercase tracking-[0.18em]
    text-zinc-600 transition-colors
    hover:text-black

    after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-200
    group-hover:after:w-full
    ${isActive(tab.id) ? "text-black after:w-full" : ""}
  `}
            >
              {tab.label}
            </Link>

            {/* Dropdown doklejony do dolnej krawędzi navki */}
            <div className="absolute left-0 top-full hidden group-hover:block">
              <div className="pt-9">
              <div
                className="
                  min-w-[190px]
                  rounded-b-2xl rounded-t-none
                  border border-zinc-200
                  bg-white/95 px-4 py-3
                  shadow-xl backdrop-blur-sm
                "
              >
                <ul className="space-y-1 text-[11px] font-medium tracking-[0.16em] text-zinc-700">
                  {getSubLinks(tab.id).map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between py-1.5 hover:text-black"
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div></div>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
