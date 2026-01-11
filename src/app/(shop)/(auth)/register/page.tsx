"use client";

import {Formik, Form, Field, ErrorMessage} from "formik";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {RegisterFormValues} from "@/types/(shop)/(auth)/register";
import {RegisterSchema} from "@/lib/validations/(shop)/(auth)/register.schema";
import { registerUser } from "@/lib/services/(shop)/(auth)/register.service";

const initialValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  marketingOptIn: false,
};

const RegisterPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: RegisterFormValues) => {
    setServerError(null);

    try {
      const result = await registerUser(values);
      if (result.ok) {
        router.push("/signin?reason=registered");
        return;
      }
      setServerError(result.error);
    } catch {
      setServerError(
        "An error occurred during registration. Please try again."
      );
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm">
        <h1 className="mb-1 text-center text-2xl font-semibold tracking-wide">
          Create your account
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-600">
          Save your favorite products, track orders, and check out faster.
        </p>

        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({isSubmitting}) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs font-medium uppercase tracking-wide text-zinc-700"
                >
                  First name
                </label>
                <Field
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                  placeholder="John"
                />
                <ErrorMessage
                  name="firstName"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-xs font-medium uppercase tracking-wide text-zinc-700"
                >
                  Last name
                </label>
                <Field
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                  placeholder="Walker"
                />
                <ErrorMessage
                  name="lastName"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wide text-zinc-700"
                >
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                  placeholder="you@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wide text-zinc-700"
                >
                  Password
                </label>

                <div className="relative mt-1">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 pr-10 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                    placeholder="Minimum 8 characters"
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
                      {showPassword ? (
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
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              <label className="flex items-start gap-3 rounded-lg bg-zinc-50 px-3 py-3">
                <Field
                  type="checkbox"
                  name="marketingOptIn"
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-black focus:ring-black"
                />
                <span className="text-xs leading-relaxed text-zinc-700">
                  I want to receive emails about new products, promotions, and
                  early access to sales. You can unsubscribe at any time.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-full bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Create my account"}
              </button>

              <p className="pt-2 text-center text-xs text-zinc-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/signin")}
                  className="font-medium text-black underline-offset-2 hover:underline"
                >
                  Log in
                </button>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default RegisterPage;
