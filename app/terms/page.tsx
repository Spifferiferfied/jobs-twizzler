import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Impossible Queries",
  description: "The terms for using Impossible Queries.",
};

export default function TermsPage() {
  return (
    <article className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="text-sm text-foreground/60">
        Last updated: September 19, 2026
      </p>

      <div className="border-2 border-primary rounded-lg p-3 bg-secondary/20 text-sm">
        <strong>Draft placeholder.</strong> Replace this page&apos;s body with
        your generated, reviewed terms before launch. The sections below are a
        starting outline.
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Acceptance of Terms</h2>
        <p>
          By using Impossible Queries, you agree to these terms. If you do not
          agree, please do not use the app.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Accounts</h2>
        <p>
          You sign in with a third-party account (Google or Apple). You are
          responsible for activity under your account.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Acceptable Use</h2>
        <p>
          Use the app for its intended purpose. Do not attempt to disrupt,
          abuse, or gain unauthorized access to the service.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Disclaimer</h2>
        <p>
          The app is provided &quot;as is,&quot; for entertainment. Questions
          are intentionally unanswerable and results are not statements of fact.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Changes</h2>
        <p>
          We may update these terms; continued use after changes means you
          accept them.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Contact</h2>
        <p>
          Questions about these terms? Contact us at{" "}
          <span className="font-bold">[your contact email]</span>.
        </p>
      </section>
    </article>
  );
}
