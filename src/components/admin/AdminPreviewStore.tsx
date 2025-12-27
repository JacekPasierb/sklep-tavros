"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function AdminPreviewStore() {
  return (
    <Link
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center gap-2
        rounded-full border border-zinc-200
        bg-white px-4 py-2 text-sm
        hover:bg-zinc-50 transition
      "
    >
      <ExternalLink className="h-4 w-4" />
      View store
    </Link>
  );
}
