import Link from "next/link";
import { SOCIALS } from "@/lib/config/shop/socials";

const SocialSection=()=> {
  return (
    <section className="container mx-auto px-4 py-6 text-center">
      <div className="flex justify-center gap-8 text-3xl">
        {SOCIALS.map(({ href, label, color, icon }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="transition-transform hover:scale-110"
            style={{ color }}
          >
            {icon}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm tracking-[0.5em] text-zinc-700">@ TAVROS</p>
    </section>
  );
}

export default SocialSection;