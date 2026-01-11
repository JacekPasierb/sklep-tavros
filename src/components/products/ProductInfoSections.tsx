
import { normalizeMultiline, splitParagraphs } from "../../lib/utils/text/normalizeMultiLine";
import { TypeProduct } from "../../types/(shop)/product";


type Props = {
  product: TypeProduct;
};

export default function ProductInfoSections({product}: Props) {
  const paragraphs = splitParagraphs(product.summary);

  const sections = product.sections ?? [];
  const careSection = sections.find((s) => /care|material/i.test(s.title));
  const featureSections = sections.filter((s) => s !== careSection);

  const delivery = normalizeMultiline(product.deliveryReturns?.content);
  const deliveryTitle = product.deliveryReturns?.title ?? "Delivery & Returns";

  return (
    <section className="mt-10 border-t border-zinc-200 pt-8">
      {/* ✅ wrapper: zawsze padding na mobile */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-900">
              Product info
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Details, materials and delivery.
            </p>
          </div>

          {product.styleCode && (
            <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
              <span className="text-zinc-500">Code:</span>{" "}
              <span className="text-zinc-900">{product.styleCode}</span>
            </div>
          )}
        </div>

        {/* Summary */}
        {paragraphs.length > 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
              Description
            </h3>
            <div className="space-y-4 text-sm leading-6 text-zinc-700">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* Sections grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {featureSections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 sm:p-6"
            >
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-800">
                {section.title}
              </h3>

              <ul className="space-y-2 text-sm text-zinc-700">
                {section.items?.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {careSection && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 sm:p-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-800">
                {careSection.title}
              </h3>

              <ul className="space-y-2 text-sm text-zinc-700">
                {careSection.items?.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-[2px]">🧵</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Delivery accordion */}
        {delivery && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-800">
                  {deliveryTitle}
                </span>

                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-700">
                {delivery}
              </div>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}
