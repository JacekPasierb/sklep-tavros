"use client";

import {Formik, Form, Field, ErrorMessage} from "formik";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";

import {SignInFormValues, SignInReason} from "@/types/(shop)/(auth)/signin";

import {getSignInReasonMessage} from "@/lib/utils/(shop)/(auth)/normalizeSignInReason";

import {SignInSchema} from "@/lib/validations/(shop)/(auth)/signin.schema";
import { signInUser } from "@/lib/services/(shop)/(auth)/signin.service";

const toneClasses = (tone: "success" | "warning") => {
  if (tone === "success") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }
  return "border-amber-300 bg-amber-50 text-amber-800";
};

const EyeIcon = ({open}: {open: boolean}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    {open ? (
      <>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-5.94" />
        <path d="M1 1l22 22" />
      </>
    )}
  </svg>
);

const SignInClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
        <h1 className="mb-4 text-center text-2xl font-semibold">
          Sign in to your account
        </h1>

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

                <div className="relative mt-1">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 pr-10 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                  />

                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-black focus:outline-none"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>

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
                {isSubmitting ? "Signing in..." : "Sign in"}
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
