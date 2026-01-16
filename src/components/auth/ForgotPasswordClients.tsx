"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

type Values = { email: string };

const Schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  const initialValues: Values = { email: "" };

  const handleSubmit = async () => {
    // Na start tylko UI — docelowo podłączysz endpoint + mail
    // Zawsze pokazuj “success” (security best practice)
    setDone(true);
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold">
          Reset your password
        </h1>

        <p className="mb-6 text-center text-sm text-zinc-600">
          Enter your email and we’ll send you a reset link.
        </p>

        {done ? (
          <>
            <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              If an account exists for this email, a reset link has been sent.
            </div>

            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="w-full rounded-full bg-black py-2.5 text-sm font-semibold text-white hover:bg-black/90"
            >
              Back to Sign in
            </button>
          </>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={Schema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-black py-2.5 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/signin")}
                  className="w-full rounded-full border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-zinc-800 hover:border-zinc-400"
                >
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </section>
  );
}
