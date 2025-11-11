import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link
      href="/"
      className="justify-self-center flex items-center gap-2 text-zinc-900"
      aria-label="Brand home"
    >
      <Image
        src="/icons/logo.svg"
        alt="Tavros logo"
        width={32}
        height={32}
        className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12"
        priority
      />
      <span className="text-[20px] tracking-[0.3em] md:tracking-[0.6em] lg:text-[22px]">
        TAVROS
      </span>
    </Link>
  );
};

export default Logo;
