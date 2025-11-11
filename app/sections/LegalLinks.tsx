"use client";

import Link from "next/link";

const legalLinks = [
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

export default function LegalLinks() {
  return (
    <div className="mb-6 flex flex-col items-center space-y-2 text-sm text-neutral-600">
        <h2 className="mb-6 text-center text-lg font-semibold tracking-tight text-neutral-800">
        Legal
      </h2>   
      {legalLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:underline"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
