import {CheckoutPayload, CheckoutResult} from "@/types/(shop)/checkout";

export const createCheckoutSession = async (
  payload: CheckoutPayload
): Promise<CheckoutResult> => {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        error: data?.error || "Something went wrong. Please try again.",
      };
    }

    if (!data?.url) {
      return {
        ok: false,
        error: "Could not start payment session. Please try again.",
      };
    }

    return {ok: true, url: String(data.url)};
  } catch {
    return {ok: false, error: "Unexpected error. Please try again."};
  }
};
