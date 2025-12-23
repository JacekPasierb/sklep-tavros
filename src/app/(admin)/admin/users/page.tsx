import Link from "next/link";
import {SectionHeader} from "../../../../components/admin/SectionHeader";
import {connectToDatabase} from "../../../../lib/mongodb";
import User from "../../../../models/User";
import {Pagination} from "../../../../components/products/Pagination";
import {DeleteUserButton} from "../../../../components/admin/DeleteUserButton";

type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

function parseIntSafe(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{page?: string; q?: string}>;
}) {
  const sp = await searchParams;

  const pageParam = parseIntSafe(sp.page, 1);
  const limit = 20;
  const q = (sp.q ?? "").trim();

  await connectToDatabase();

  const filter: Record<string, unknown> = {role: "user"};
  if (q) {
    filter.$or = [
      {email: {$regex: q, $options: "i"}},
      {firstName: {$regex: q, $options: "i"}},
      {lastName: {$regex: q, $options: "i"}},
    ];
  }

  const total = await User.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(pageParam, pages);

  const rows = await User.find(filter)
    .sort({createdAt: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .select({email: 1, firstName: 1, lastName: 1, createdAt: 1})
    .lean<
      Array<{
        _id: unknown;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
      }>
    >();

  const users: PublicUser[] = rows.map((u) => ({
    id: String(u._id),
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Management"
        title="Users"
        description="Admin-only list of registered accounts."
      />

      {/* Search */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Search
            </label>
            <input
              name="q"
              defaultValue={q}
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

      {/* Table */}
<div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
  {/* Top bar */}
  <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between gap-3">
    <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
      {total} total
    </div>

    <div className="text-xs text-zinc-500">
      Page <span className="text-black font-medium">{page}</span> / {pages}
    </div>
  </div>

  {/* Column headers (desktop/tablet) */}
  <div className="hidden sm:block px-5 py-3 border-b border-zinc-200">
    <div className="grid grid-cols-12 gap-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
      <div className="col-span-4">Name</div>
      <div className="col-span-5">Email</div>
      <div className="col-span-2 text-right">Created</div>
      <div className="col-span-1 text-right">Actions</div>
    </div>
  </div>

  {/* Rows */}
  <div className="divide-y divide-zinc-200">
    {users.map((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.trim();

      return (
        <div key={u.id} className="px-5 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4 sm:items-center">
            {/* Name */}
            <div className="sm:col-span-4 min-w-0">
              <div className="text-sm font-semibold text-black truncate">
                {fullName || "Customer"}
              </div>

              {/* Mobile meta */}
              <div className="mt-1 sm:hidden text-xs text-zinc-500">
                Created: {new Date(u.createdAt).toLocaleDateString("en-GB")}
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-5 min-w-0">
              <a
                href={`mailto:${u.email}`}
                className="text-sm text-zinc-600 underline-offset-4 hover:underline break-all sm:break-normal sm:truncate block"
              >
                {u.email}
              </a>
            </div>

            {/* Created (desktop/tablet) */}
            <div className="hidden sm:block sm:col-span-2 text-right text-xs text-zinc-500">
              {new Date(u.createdAt).toLocaleDateString("en-GB")}
            </div>

            {/* Actions */}
            <div className="sm:col-span-1 flex sm:justify-end">
              <DeleteUserButton userId={u.id} />
            </div>
          </div>
        </div>
      );
    })}

    {users.length === 0 ? (
      <div className="px-5 py-10 text-sm text-zinc-600">No users found.</div>
    ) : null}
  </div>

  {/* Pagination */}
  <div className="px-5 py-4 border-t border-zinc-200">
    <Pagination currentPage={page} totalPages={pages} />
  </div>
</div>

    </div>
  );
}
