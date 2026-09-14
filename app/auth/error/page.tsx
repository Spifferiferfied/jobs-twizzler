export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-foreground/60">Could not sign you in. Please try again.</p>
      <a href="/auth/login" className="underline text-primary hover:text-secondary transition-colors">
        Back to sign in
      </a>
    </div>
  );
}
