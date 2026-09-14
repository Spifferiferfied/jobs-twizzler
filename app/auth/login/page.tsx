import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { signInWithGoogle, signInWithApple } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { next } = await searchParams;

  if (user) {
    redirect(next ?? "/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl font-bold">Sign in to vote</h1>
      <p className="text-foreground/60 text-sm">
        Your vote will be locked in — no take-backs.
      </p>
      <div className="flex flex-col gap-3 w-64">
        <form action={signInWithGoogle}>
          <input type="hidden" name="next" value={next ?? "/"} />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-secondary bg-secondary-dark rounded-lg hover:bg-secondary-dark/60 transition-colors"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </form>
        <form action={signInWithApple}>
          <input type="hidden" name="next" value={next ?? "/"} />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-secondary bg-black text-white rounded-lg hover:bg-black/70 transition-colors"
          >
            <AppleIcon />
            Sign in with Apple
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 814 1000" fill="white" aria-hidden="true">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-120.8C46.3 790.7 0 663 0 541.8 0 285.7 165.7 159.8 328.2 159.8c89.5 0 164 59.5 220.6 59.5 54.1 0 139.2-62.8 241.6-62.8zm-65.1-155.2c-1.9-12-1.9-23.9-1.9-35.8 0-87.6 47.8-164 109.7-210.4 5.8-3.9 18.4-14.5 28-14.5 1.3 0 2.6.6 3.9.6.6 6.5.6 13 .6 19.5 0 80.1-46.1 153.6-107.4 200.5-5.2 3.2-21.9 17.5-32.9 40.1z" />
    </svg>
  );
}
