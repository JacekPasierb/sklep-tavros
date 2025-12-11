// src/components/account/orders/PaymentStatusCard.tsx
import React from "react";
import { getPaymentMeta } from "../../../lib/utils/orders";
import { AccountOrder } from "../../../types/order";


type PaymentStatusCardProps = {
  paymentStatus: AccountOrder["paymentStatus"];
};

export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  paymentStatus,
}) => {
  const { badgeClass, panelClass, label, description, displayStatus } =
    getPaymentMeta(paymentStatus);

  return (
    <div
      className={`mt-4 rounded-2xl border px-4 py-3 sm:px-5 sm:py-3.5 ${panelClass}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Payment status
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">{label}</p>
          <p className="mt-1 text-xs leading-snug text-zinc-700">
            {description}
          </p>
        </div>

        <span
          className={`inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${badgeClass}`}
        >
          {displayStatus}
        </span>
      </div>
    </div>
  );
};
