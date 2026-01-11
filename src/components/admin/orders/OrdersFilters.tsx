import Link from "next/link";
import type {FulfillmentStatus, PaymentStatus} from "../../../types/shop/order";

type Props = {
  q: string;
  paymentStatus: PaymentStatus | "";
  fulfillmentStatus: FulfillmentStatus | "";
};

const INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black";

const LABEL_CLASS = "text-[11px] uppercase tracking-[0.18em] text-zinc-500";

const paymentOptions: Array<{label: string; value: PaymentStatus | ""}> = [
  {label: "All", value: ""},
  {label: "Pending", value: "pending"},
  {label: "Paid", value: "paid"},
  {label: "Canceled", value: "canceled"},
];

const fulfillmentOptions: Array<{
  label: string;
  value: FulfillmentStatus | "";
}> = [
  {label: "All", value: ""},
  {label: "Created", value: "created"},
  {label: "Processing", value: "processing"},
  {label: "Shipped", value: "shipped"},
  {label: "Delivered", value: "delivered"},
  {label: "Canceled", value: "canceled"},
];

const OrdersFilters = ({q, paymentStatus, fulfillmentStatus}: Props) => {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5">
      {/* GET sprawia, że filtry lądują w URL jako query string */}
      <form
        method="get"
        className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end"
      >
        <div className="sm:col-span-5">
          <label className={LABEL_CLASS} htmlFor="q">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Order number, email, customer…"
            className={INPUT_CLASS}
          />
        </div>

        <div className="sm:col-span-3">
          <label className={LABEL_CLASS} htmlFor="paymentStatus">
            Payment
          </label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            defaultValue={paymentStatus}
            className={INPUT_CLASS}
          >
            {paymentOptions.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className={LABEL_CLASS} htmlFor="fulfillmentStatus">
            Fulfillment
          </label>
          <select
            id="fulfillmentStatus"
            name="fulfillmentStatus"
            defaultValue={fulfillmentStatus}
            className={INPUT_CLASS}
          >
            {fulfillmentOptions.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1 flex gap-2 sm:justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-black/90"
          >
            Apply
          </button>
        </div>

        <div className="sm:col-span-12">
          <Link
            href="/admin/orders"
            className="inline-flex rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-zinc-50"
          >
            Reset
          </Link>
        </div>
      </form>
    </div>
  );
};

export default OrdersFilters;
