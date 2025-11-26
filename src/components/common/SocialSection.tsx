import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const socials = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    color: "#1877F2",
    icon: <FaFacebookF />,
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    color: "#E4405F",
    icon: <FaInstagram />,
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    color: "#FF0000",
    icon: <FaYoutube />,
  },
  {
    href: "https://tiktok.com",
    label: "TikTok",
    color: "#000000",
    icon: <FaTiktok />,
  },
];

const SocialSection=()=> {
  return (
    <section className="container mx-auto px-4 py-6 text-center">
      <div className="flex justify-center gap-8 text-3xl">
        {socials.map(({ href, label, color, icon }) => (
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