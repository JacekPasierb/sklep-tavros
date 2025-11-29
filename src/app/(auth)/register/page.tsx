"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  marketingOptIn: boolean;
}

const RegisterSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "Minimum 2 znaki")
    .required("Imię jest wymagane"),
  lastName: Yup.string()
    .min(2, "Minimum 2 znaki")
    .required("Nazwisko jest wymagane"),
  email: Yup.string()
    .email("Nieprawidłowy adres e-mail")
    .required("E-mail jest wymagany"),
  password: Yup.string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .required("Hasło jest wymagane"),
  marketingOptIn: Yup.boolean(),
});

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    marketingOptIn: false,
  };

  const handleSubmit = async (values: FormValues) => {
    setServerError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(values),
      });

      if (res.status === 201) {
        // po udanej rejestracji kierujemy na logowanie
        router.push("/signin?reason=registered");
        return;
      }

      if (res.status === 409) {
        setServerError("Ten adres e-mail jest już używany.");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setServerError(data?.message || "Nie udało się utworzyć konta.");
    } catch (err) {
      console.error(err);
      setServerError("Błąd sieci. Spróbuj ponownie za chwilę.");
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm">
        <h1 className="mb-1 text-center text-2xl font-semibold tracking-wide">
          Create your account
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-600">
          Zapisz ulubione produkty, śledź zamówienia i szybciej finalizuj zakupy.
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
              {/* Imię */}
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

              {/* Nazwisko */}
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

              {/* Email */}
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

              {/* Hasło */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wide text-zinc-700"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10"
                  placeholder="Minimum 8 characters"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-xs text-red-600"
                />
              </div>

              {/* Marketing checkbox */}
              <label className="flex items-start gap-3 rounded-lg bg-zinc-50 px-3 py-3">
                <Field
                  type="checkbox"
                  name="marketingOptIn"
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-black focus:ring-black"
                />
                <span className="text-xs leading-relaxed text-zinc-700">
                  Chcę otrzymywać e-maile z nowościami, promocjami i wcześniejszym dostępem
                  do wyprzedaży. Możesz wypisać się w każdej chwili.
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
                Masz już konto?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/account/signin")}
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
}
