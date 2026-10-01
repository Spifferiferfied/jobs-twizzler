import type { Metadata } from "next";
import { TERMS_HTML } from "./content";

export const metadata: Metadata = {
  title: "Terms of Service — Impossible Queries",
  description: "The terms for using Impossible Queries.",
};

export default function TermsPage() {
  return (
    // Trusted, pre-sanitized static legal content (see content.ts).
    <article
      className="policy"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static, trusted, sanitized legal content
      dangerouslySetInnerHTML={{ __html: TERMS_HTML }}
    />
  );
}
