const CookiePolicy = () => {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">
        Cookie Policy
      </h1>

      <section className="space-y-4 text-sm leading-relaxed text-zinc-700">
        <p>
          This Cookie Policy explains how we use cookies and similar technologies
          on our website.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-zinc-900">
          What are cookies?
        </h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help ensure the website works properly and improve your
          browsing experience.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-zinc-900">
          How we use cookies
        </h2>
        <p>We use cookies to:</p>
        <ul className="list-disc pl-6">
          <li>Enable essential website functionality</li>
          <li>Remember your preferences</li>
          <li>Improve performance and user experience</li>
        </ul>

        <h2 className="pt-4 text-lg font-semibold text-zinc-900">
          Managing cookies
        </h2>
        <p>
          You can control or delete cookies at any time through your browser
          settings. Please note that disabling cookies may affect how the
          website functions.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-zinc-900">
          Changes to this policy
        </h2>
        <p>
          We may update this Cookie Policy from time to time. Any changes will
          be posted on this page.
        </p>

        <p className="pt-6 text-xs text-zinc-500">
          Last updated: {new Date().getFullYear()}
        </p>
      </section>
    </main>
  );
};

export default CookiePolicy;
