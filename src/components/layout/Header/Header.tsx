// components/layout/Header/Header.tsx
"use client";

import {Menu} from "lucide-react";
import React, {useState} from "react";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import IconsBar from "./IconsBar";
import DesktopNav from "./DesktopNav";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex items-center justify-between">
          {/* LEWO: burger (mobile) + nav (desktop) */}
          <div className="flex flex-1 items-center gap-3">
            {/* hamburger tylko na mobile */}
            <button
              className="grid h-9 w-9 place-items-center cursor-pointer lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktopowe menu – ukryte na mobile */}
            <div className="hidden lg:block">
              <DesktopNav />
            </div>
          </div>

          {/* ŚRODEK: logo ZAWSZE idealnie na środku */}
          <div className="flex flex-none justify-center">
            <Logo />
          </div>

          {/* PRAWO: ikony konta / wishlisty / koszyka */}
          <div className="flex flex-1 justify-end">
            <IconsBar />
          </div>
        </div>
      </div>

      {/* off-canvas menu na mobile */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
};

export default Header;
