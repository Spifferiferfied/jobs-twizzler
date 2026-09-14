import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/auth/login/actions";
import { createClient } from "@/utils/supabase/server";
import "./globals.css";

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

  return (
    <html lang="en">
      <body className={`${barlow.variable} antialiased`}>
        <header className="flex items-center justify-between px-6 py-4 border-b border-secondary/30">
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
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
