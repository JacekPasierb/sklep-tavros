"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  src: string;
  alt?: string;
  primary?: boolean;
};

type Props = {
  value: ProductImage[];
  onChange: (next: ProductImage[]) => void;
  max?: number;
};

export function ProductImagesField({ value, onChange, max = 5 }: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const images = value ?? [];

  const setPrimary = (idx: number) => {
    const next = images.map((img, i) => ({ ...img, primary: i === idx }));
    onChange(next);
  };

  const updateAlt = (idx: number, alt: string) => {
    const next = images.map((img, i) => (i === idx ? { ...img, alt } : img));
    onChange(next);
  };

  const remove = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    // jeśli skasowałeś primary, ustaw pierwszy jako primary
    if (!next.some((x) => x.primary) && next.length > 0) next[0].primary = true;
    onChange(next);
  };

  const upload = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "tavros/products");

    const res = await fetch("/api/admin/uploads", {
      method: "POST",
      body: fd,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.error ?? "Upload failed");

    return json.image as { url: string; publicId: string };
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (images.length >= max) return;

    const idx = images.length;
    setUploadingIndex(idx);

    try {
      const uploaded = await upload(file);

      const next = [
        ...images,
        {
          src: uploaded.url,
          alt: "",
          primary: images.length === 0, // pierwszy jako primary
        },
      ];

      onChange(next);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Images
          </div>
          <p className="mt-1 text-sm text-zinc-600">
            Add up to {max} images. Select one as primary.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-black/90">
          + Add image
          <input
            type="file"
            accept="image/*"
            onChange={onPick}
            className="hidden"
            disabled={images.length >= max}
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500">
          No images yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((img, idx) => {
            const isPrimary = !!img.primary;
            return (
              <div
                key={`${img.src}-${idx}`}
                className="rounded-2xl border border-zinc-200 overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-zinc-100">
                  <Image
                    src={img.src}
                    alt={img.alt || "Product image"}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />

                  <div className="absolute left-2 top-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPrimary(idx)}
                      className={[
                        "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                        isPrimary
                          ? "bg-black text-white"
                          : "bg-white/90 text-black border border-zinc-200 hover:bg-white",
                      ].join(" ")}
                    >
                      {isPrimary ? "Primary" : "Set primary"}
                    </button>
                  </div>

                  <div className="absolute right-2 top-2">
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="rounded-full bg-white/90 border border-zinc-200 px-3 py-1 text-[11px] font-semibold hover:bg-white"
                    >
                      Remove
                    </button>
                  </div>

                  {uploadingIndex === idx && (
                    <div className="absolute inset-0 grid place-items-center bg-black/20">
                      <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold">
                        Uploading…
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-2">
                  <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Alt text
                  </label>
                  <input
                    value={img.alt ?? ""}
                    onChange={(e) => updateAlt(idx, e.target.value)}
                    placeholder="e.g. Tavros Mens Hoodie front view"
                    className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
