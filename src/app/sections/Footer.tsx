"use client";

type FooterProps = {
  company?: string;
  tagline?: string;
  companyHref?: string;
};

export default function Footer({
  company = "Tavros Limited",
  tagline = "We Do Style.",
  companyHref = "/",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="container mx-auto border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-4">
        <p className="py-6 text-center text-sm text-neutral-600">
          © {year}{" "}
          <a
            href={companyHref}
            className="font-medium text-neutral-800 hover:underline"
          >
            {company}
          </a>{" "}
          <span className="mx-2">|</span>
          All Rights Reserved.
          <span className="mx-2">|</span> {tagline}
        </p>
      </div>
    </footer>
  );
}
