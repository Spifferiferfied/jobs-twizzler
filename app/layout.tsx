import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/auth/login/actions";
import { isAdmin } from "@/utils/auth";
import { createClient } from "@/utils/supabase/server";
import HeapIdentify from "./HeapIdentify";
import HeapLoader from "./HeapLoader";
import ProfileMenu from "./ProfileMenu";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Impossible Queries",
  description: "Bar debates for the ungoogleable.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin = await isAdmin();

  return (
    <html lang="en">
      <body className={`${barlow.variable} antialiased`}>
        <GoogleTagManager gtmId="GTM-TSZMP4FP" />
        <HeapLoader />
        <HeapIdentify
          userId={user?.id}
          role={user ? (admin ? "admin" : "member") : undefined}
          authProvider={user?.app_metadata?.provider}
        />
        <noscript>
          <iframe
            title="gtm-iframe"
            src="https://www.googletagmanager.com/ns.html?id=GTM-TSZMP4FP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <header className="flex items-center justify-between px-4 py-4 border-b border-secondary/30">
          <Link href="/" className="font-semibold">
            <Image
              src="/logo.svg"
              alt="Impossible Queries Logo"
              width={32}
              height={32}
              className="inline-block mr-2"
            />
            Impossible Queries
          </Link>
          <div>
            {user ? (
              admin ? (
                <ProfileMenu />
              ) : (
                <form action={signOut}>
                  <button
                    type="submit"
                    className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              )
            ) : (
              <Link
                href="/auth/login"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
        <footer>@ 2026 Impossible Queries</footer>
      </body>
    </html>
  );
}
