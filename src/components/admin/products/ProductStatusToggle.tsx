"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";

type Props = {
  productId: string;
  status: "ACTIVE" | "HIDDEN";
};

export function ProductStatusToggle({productId, status}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const next = status === "ACTIVE" ? "HIDDEN" : "ACTIVE";

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/products/${productId}/status`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({status: next}),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold hover:bg-zinc-50 disabled:opacity-50"
    >
      {status === "ACTIVE" ? "Hide" : "Unhide"}
    </button>
  );
}
