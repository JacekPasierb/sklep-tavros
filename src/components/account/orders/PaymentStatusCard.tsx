"use client";

import {AccountOrder} from "@/types/(shop)/account/orders";
import {getPaymentMeta} from "@/lib/utils/(shop)/account/orders/getPaymentMeta";
import {useState} from "react";

type Props = {
  paymentStatus: AccountOrder["paymentStatus"];
  orderId: string;
};

export const PaymentStatusCard = ({paymentStatus, orderId}: Props) => {
  const {badgeClass, panelClass, label, description, displayStatus} =
    getPaymentMeta(paymentStatus);

  const isPending = paymentStatus === "pending";
  const [isLoading, setIsLoading] = useState(false);

  const onPayNow = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const res = await fetch(`/api/account/orders/${orderId}/pay`, {
        method: "POST",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Unable to continue payment.");
      }

      if (!data?.url) {
        throw new Error("Missing payment URL.");
      }

      // 🔁 redirect do Stripe
      window.location.href = data.url;
    } catch (e) {
      alert(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`mt-4 rounded-2xl border px-4 py-3 sm:px-5 sm:py-3.5 ${panelClass}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Payment status
          </p>

          <p className="text-sm font-semibold text-zinc-900">{label}</p>
          <p className="text-xs leading-snug text-zinc-700">{description}</p>

          {isPending && (
            <button
              type="button"
              onClick={onPayNow}
              disabled={isLoading}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-50 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Redirecting…" : "Complete payment"}
            </button>
          )}
        </div>

        <span
          className={`self-start sm:self-auto inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${badgeClass}`}
        >
          {displayStatus}
        </span>
      </div>
    </div>
  );
};
