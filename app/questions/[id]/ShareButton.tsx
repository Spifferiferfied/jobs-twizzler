"use client";

import Image from "next/image";
import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Impossible Queries",
          text: title,
          url,
        });
      } catch {
        // user cancelled or share failed — no-op
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="Share"
      className="absolute right-0 top-2"
    >
      <Image src="/icons/share.svg" alt="" width={24} height={24} />
      {copied && (
        <span className="absolute right-0 top-7 text-xs text-secondary whitespace-nowrap">
          Copied!
        </span>
      )}
    </button>
  );
}
