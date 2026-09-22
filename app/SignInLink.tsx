"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignInLink({ className }: { className?: string }) {
  const pathname = usePathname();
  // Return the user to where they were (but never loop back to an auth page).
  const href =
    pathname && !pathname.startsWith("/auth")
      ? `/auth/login?next=${encodeURIComponent(pathname)}`
      : "/auth/login";

  return (
    <Link href={href} className={className}>
      Sign In
    </Link>
  );
}
