"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import { FulfillmentStatus, PaymentStatus } from "../../../types/(shop)/account/orders";


type Props = {
  orderId: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  kind: "payment" | "fulfillment";
};

const OrderStatusControls = ({
  orderId,
  paymentStatus,
  fulfillmentStatus,
  kind,
}: Props) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const value: PaymentStatus | FulfillmentStatus =
    kind === "payment" ? paymentStatus : fulfillmentStatus;

  const onChange = async (next: string) => {
    setIsSaving(true);
    try {
      const body =
        kind === "payment"
          ? {paymentStatus: next as PaymentStatus}
          : {fulfillmentStatus: next as FulfillmentStatus};

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(body),
      });

      if (res.ok) router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <select
      value={value}
      disabled={isSaving}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-black disabled:opacity-60"
    >
      {kind === "payment" ? (
        <>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="canceled">Canceled</option>
        </>
      ) : (
        <>
          <option value="created">Created</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </>
      )}
    </select>
  );
};
export default OrderStatusControls;
