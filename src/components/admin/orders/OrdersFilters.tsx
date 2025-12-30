import Link from "next/link";
import {FulfillmentStatus, PaymentStatus} from "../../../types/order";

type Props = {
  q: string;
  paymentStatus: PaymentStatus | "";
  fulfillmentStatus: FulfillmentStatus | "";
};

const OrdersFilters = ({q, paymentStatus, fulfillmentStatus}: Props) => {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5">
      <form className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
        <div className="sm:col-span-5">
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Search
          </label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Order number, email, customer…"
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Payment
          </label>
          <select
            name="paymentStatus"
            defaultValue={paymentStatus}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Fulfillment
          </label>
          <select
            name="fulfillmentStatus"
            defaultValue={fulfillmentStatus}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
          >
            <option value="">All</option>
            <option value="created">Created</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
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
