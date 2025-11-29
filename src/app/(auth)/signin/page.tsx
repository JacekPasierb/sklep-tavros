"use client";

import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import {useRouter, useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";
import {useState} from "react";

const LoginSchema = Yup.object({
  email: Yup.string().email("Nieprawidłowy email").required("Wymagane"),
  password: Yup.string().required("Wymagane"),
});

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const reason = searchParams.get("reason");
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallbackUrl && rawCallbackUrl.startsWith("/")
      ? rawCallbackUrl
      : "/account";

  const initialValues = {email: "", password: ""};

  const handleSubmit = async (
    values: typeof initialValues,
    {setSubmitting}: {setSubmitting: (b: boolean) => void}
  ) => {
    setServerError(null);

    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (!res) {
        setServerError("Brak odpowiedzi z serwera logowania.");
        return;
      }

      if (res.error) {
        setServerError("Błędny email lub hasło.");
        return;
      }

      // sukces → przekieruj
      router.push(callbackUrl);
    } catch (e) {
      console.error(e);
      setServerError("Błąd logowania. Spróbuj ponownie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm">
        <h1 className="mb-4 text-center text-2xl font-semibold">Log in</h1>

        {/* komunikat na podstawie reason w URL */}
        {reason === "registered" && (
          <div className="mb-4 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Konto zostało utworzone. Możesz się teraz zalogować.
          </div>
        )}
        {reason === "favorites" && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Ulubione wymagają zalogowania. Zaloguj się, aby zobaczyć swoją listę.
          </div>
        )}
        {reason === "myaccount" && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Dostęp do konta wymaga zalogowania.
          </div>
        )}

        {/* błąd serwera / logowania */}
        {serverError && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
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
                Nie masz konta?{" "}
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
}
