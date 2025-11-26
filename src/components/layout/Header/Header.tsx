"use client";

import {Menu} from "lucide-react";
import React, {useState} from "react";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import IconsBar from "./IconsBar";


const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="container mx-auto px-4 py-4 grid grid-cols-[40px_1fr_auto] items-center gap-2 md:py-5 lg:grid-cols-[1fr_auto_1fr]">
        <button
          className="grid h-9 w-9 place-items-center cursor-pointer"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        <Logo />
        <IconsBar />
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
};

export default Header;
