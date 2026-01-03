// Internal paths only (prevents open redirect)
export function sanitizeCallbackUrl(raw: string | null, fallback: string) {
    if (!raw) return fallback;
    if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
    return fallback;
  }
  