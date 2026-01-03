"use client";

import {Formik, Form, Field, ErrorMessage} from "formik";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {SignInFormValues, SignInReason} from "../../../../types/auth/signin";
import {getSignInReasonMessage} from "../../../../lib/utils/auth/signinReasonMessages";
import {signInUser} from "../../../../lib/services/auth/signin.service";
import {SignInSchema} from "../../../../lib/validations/auth/signin.schema";

const toneClasses = (tone: "success" | "warning") => {
  if (tone === "success") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }
  return "border-amber-300 bg-amber-50 text-amber-800";
};

const SignInClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const reason = (searchParams.get("reason") as SignInReason) ?? null;
  const rawCallbackUrl = searchParams.get("callbackUrl");

  const reasonMsg = getSignInReasonMessage(reason);

  const initialValues: SignInFormValues = {email: "", password: ""};

  const handleSubmit = async (values: SignInFormValues) => {
    setServerError(null);

    const result = await signInUser(values, rawCallbackUrl);

    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    router.push(result.redirectTo);
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm">
        <h1 className="mb-4 text-center text-2xl font-semibold">Log in</h1>

        {reasonMsg && (
          <div
            className={`mb-4 rounded-md border px-3 py-2 text-sm ${toneClasses(
              reasonMsg.tone
            )}`}
          >
            {reasonMsg.text}
          </div>
        )}

        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={SignInSchema}
          onSubmit={handleSubmit}
        >
          {({isSubmitting}) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-zinc-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-zinc-700">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-black py-2.5 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>

              <p className="pt-2 text-center text-xs text-zinc-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="font-medium text-black underline-offset-2 hover:underline"
                >
                  Create account
                </button>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};
export default SignInClient;
