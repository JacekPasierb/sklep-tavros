import Link from "next/link";

type Props = {
  defaultQ: string;
};

const AdminUsersFilters=({ defaultQ }: Props) =>{
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5">
      <form className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Search
          </label>
          <input
            name="q"
            defaultValue={defaultQ}
            placeholder="Email, first name, last name…"
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-black/90"
          >
            Apply
          </button>

          <Link
            href="/admin/users"
            className="rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-zinc-50"
          >
            Reset
          </Link>
        </div>
      </form>
    </div>
  );
}
export default AdminUsersFilters;