// app/coming-soon/page.tsx
import Link from "next/link";

type Props = {
  searchParams: Promise<{ c?: string }>;
};

const ComingSoonPage = async ({ searchParams }: Props) => {
  const { c } = await searchParams;

  const label =
    c === "womens" ? "Women" :
    c === "kids" ? "Kids" :
    "Collection";

  const info =
    c === "womens" || c === "kids"
      ? "Currently, only the Men’s collection is available."
      : "We are working on this collection. Please check back soon.";

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <h1 style={{ fontSize: 34, letterSpacing: 2, marginBottom: 12 }}>
          {label} Collection — Coming Soon
        </h1>

        <p style={{ opacity: 0.75, lineHeight: 1.6, marginBottom: 14 }}>
          We are preparing this collection. Please check back soon.
        </p>

        <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 24 }}>
          {info}
        </p>

        <Link
          href="/mens/all"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            border: "1px solid #111",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          View Men’s Collection
        </Link>
      </div>
    </main>
  );
};

export default ComingSoonPage;
