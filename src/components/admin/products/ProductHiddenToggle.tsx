"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import { ProductStatus } from "../../../types/(shop)/product";


type Props = {
  productId: string;
  status: ProductStatus;
};

export const ProductHiddenToggle = ({productId, status}: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const hidden = status === "HIDDEN";

  const onChange = async (nextHidden: boolean) => {
    setLoading(true);

    const nextStatus = nextHidden ? "HIDDEN" : "ACTIVE";

    const res = await fetch(`/api/admin/products/${productId}/status`, {
      method: "PATCH",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({status: nextStatus}),
    });

    setLoading(false);

    if (!res.ok) {
      // minimal: możesz dodać toast, ale na MVP wystarczy
      alert("Failed to update status");
      return;
    }

    router.refresh();
  };

  return (
    <label className="inline-flex items-center gap-2 text-xs text-zinc-700">
      <input
        type="checkbox"
        checked={hidden}
        disabled={loading}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      Hidden
    </label>
  );
};
