/**
 * Returns a safe same-origin relative path for post-login redirects.
 * Rejects absolute URLs and protocol-relative/backslash tricks to prevent
 * open redirects (e.g. ?next=https://evil.com or ?next=//evil.com).
 */
export function safeNext(next?: string | null): string {
  if (!next) return "/";
  if (!next.startsWith("/")) return "/";
  if (next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}
