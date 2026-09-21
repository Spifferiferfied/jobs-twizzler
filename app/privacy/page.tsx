import type { Metadata } from "next";
import { PRIVACY_HTML } from "./content";

export const metadata: Metadata = {
  title: "Privacy Policy — Impossible Queries",
  description: "How Impossible Queries collects and uses your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Trusted, pre-sanitized static legal content (see content.ts). */}
      <article
        className="policy"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static, trusted, sanitized legal content
        dangerouslySetInnerHTML={{ __html: PRIVACY_HTML }}
      />
      <p className="mt-6 text-sm text-foreground/60">
        Powered by{" "}
        <a
          href="https://termly.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-secondary"
        >
          Termly
        </a>
      </p>
    </>
  );
}
