import { RegisterFormValues } from "@/types/(shop)/(auth)/register";


type RegisterResult = {ok: true} | {ok: false; error: string};

export const registerUser = async (
  values: RegisterFormValues
): Promise<RegisterResult> => {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(values),
    });

    if (res.status === 201) {
      return {ok: true};
    }

    if (res.status === 409) {
      return {ok: false, error: "This email address is already in use."};
    }

    const data = await res.json().catch(() => ({}));
    return {
      ok: false,
      error: data?.message || "Failed to create an account.",
    };
  } catch {
    return {
      ok: false,
      error: "Network error. Please try again later.",
    };
  }
};
