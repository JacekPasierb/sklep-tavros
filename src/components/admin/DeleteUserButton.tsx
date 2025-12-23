"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

type Props = {
  userId: string;
  label?: string;
  disabled?: boolean;
};

export function DeleteUserButton({userId, label = "Delete", disabled}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {method: "DELETE"});
      const data = (await res.json()) as {error?: string};

      if (!res.ok) {
        setError(data.error ?? "Delete failed");
        return;
      }

      setOpen(false);
      router.refresh(); // odświeża server page listę users
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
      >
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => !isLoading && setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Confirm
            </p>
            <h3 className="mt-2 text-lg font-semibold text-black">
              Delete this user?
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              This action is permanent.
            </p>

            {error ? (
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm transition hover:bg-zinc-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={isLoading}
                className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90 disabled:opacity-50"
              >
                {isLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
