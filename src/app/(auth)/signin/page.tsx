// app/(auth)/signin/page.tsx
import { Suspense } from "react";
import SignInClient from "./SignInClient";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 py-10">
          <p className="text-center text-sm text-zinc-500">Loading…</p>
        </main>
      }
    >
      <SignInClient />
    </Suspense>
  );
}
