import {getSession, signIn} from "next-auth/react";
import {SignInFormValues} from "../../../../types/(shop)/(auth)/signin";
import {sanitizeCallbackUrl} from "../../../utils/(shop)/(auth)/sanitizeCallbackUrl";

type SignInResult = {ok: true; redirectTo: string} | {ok: false; error: string};

export async function signInUser(
  values: SignInFormValues,
  rawCallbackUrl: string | null
): Promise<SignInResult> {
  const safeCallbackUrl = sanitizeCallbackUrl(rawCallbackUrl, "/account");

  const res = await signIn("credentials", {
    email: values.email,
    password: values.password,
    redirect: false,
    callbackUrl: safeCallbackUrl,
  });

  if (!res) {
    return {ok: false, error: "No response from the sign-in server."};
  }

  if (res.error) {
    return {ok: false, error: "Invalid email or password."};
  }

  const session = await getSession();
  const role = (session?.user as {role?: string} | undefined)?.role;
  const isAdmin = role === "admin";

  // Admin: always go to /admin unless callback already targets /admin
  if (isAdmin) {
    const adminTarget = safeCallbackUrl.startsWith("/admin")
      ? safeCallbackUrl
      : "/admin";
    return {ok: true, redirectTo: adminTarget};
  }

  // User: block /admin callback for UX
  const userTarget = safeCallbackUrl.startsWith("/admin")
    ? "/account"
    : safeCallbackUrl;

  return {ok: true, redirectTo: userTarget};
}
