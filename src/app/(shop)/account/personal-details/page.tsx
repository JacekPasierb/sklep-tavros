import Link from "next/link";

export default function PersonalDetailsPage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white px-6 py-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">Personal details</h1>
        <p className="mb-6 text-sm text-zinc-600">
          This section is coming soon.
        </p>

        <Link
          href="/account"
          className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:border-zinc-400"
        >
          Back to account
        </Link>
      </div>
    </section>
  );
}
