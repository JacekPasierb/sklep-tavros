const PrivacyPolicy = () => {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">
        Privacy Policy
      </h1>

      <section className="space-y-4 text-sm leading-relaxed text-zinc-700">
        <p>
          This Privacy Policy describes how we collect, use, and protect your
          personal information when you use our website.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-zinc-900">
          Information we collect
        </h2>
        <p>
          We may collect personal information such as your name, email address,
          shipping address, and payment details when you create an account or
          place an order.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-zinc-900">
          How we use your information
        </h2>
        <p>Your personal data may be used to:</p>
        <ul className="list-disc pl-6">
          <li>Process and fulfill your orders</li>
          <li>Manage your account</li>
          <li>Communicate with you regarding orders or support requests</li>
          <li>Improve our products and services</li>
        </ul>

        <h2 className="pt-4 text-lg font-semibold text-zinc-900">
          Data protection
        </h2>
        <p>
          We take appropriate technical and organizational measures to protect
          your personal data against unauthorized access, loss, or misuse.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-zinc-900">
          Your rights
        </h2>
        <p>
          You have the right to access, correct, or delete your personal data in
          accordance with applicable data protection laws.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-zinc-900">
          Changes to this policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be published on this page.
        </p>

        <p className="pt-6 text-xs text-zinc-500">
          Last updated: {new Date().getFullYear()}
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
