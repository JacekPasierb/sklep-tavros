import Image from "next/image";
import { ImgInput } from "../../../types/admin/productForm";


type Props = {
  title: string;
  images: ImgInput[];
  onUpload: (idx: number, file: File | null) => void;
  onRemove: (idx: number) => void;
};

export function ImagesSection({ title, images, onUpload, onRemove }: Props) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-4 sm:p-5 space-y-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          Images (max 5) — slot #1 is MAIN (required)
        </p>
        <p className="text-sm text-zinc-600">Upload images and we’ll handle the rest.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="rounded-2xl border border-zinc-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-zinc-700">
                {idx === 0 ? "Main image" : `Image #${idx + 1}`}
                {idx === 0 && (
                  <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">
                    REQUIRED
                  </span>
                )}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onUpload(idx, e.target.files?.[0] ?? null)}
                />
                {img.uploading ? "Uploading…" : "Upload"}
              </label>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <div className="relative h-24 w-full overflow-hidden rounded-xl bg-zinc-100 border">
                  {img.src ? (
                    <Image
                      src={img.src}
                      alt={title ? `${title} image ${idx + 1}` : "Product image"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-xs text-zinc-400">
                      No image
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-8">
                <p className="text-xs text-zinc-500">
                  {img.src ? "Image uploaded." : "Upload an image to fill this slot."}
                </p>

                {img.src && (
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-50"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
