"use client";

import { useEffect } from "react";

type HeapAPI = {
  identify: (identity: string) => void;
  addUserProperties: (props: Record<string, string | number | boolean>) => void;
  resetIdentity: () => void;
};

declare global {
  interface Window {
    heap?: HeapAPI;
  }
}

type Props = {
  userId?: string;
  role?: string;
  authProvider?: string;
};

/**
 * Identifies the signed-in user to Heap (via the Supabase user id — stable,
 * unique, non-PII) and attaches non-PII segmentation properties.
 * Heap is injected by GTM after hydration, so we wait for window.heap.
 * Anonymous users are left with Heap's own anonymous id (no reset here).
 */
export default function HeapIdentify({ userId, role, authProvider }: Props) {
  useEffect(() => {
    if (!userId) return;

    let tries = 0;
    let timer: number | undefined;

    const run = () => {
      if (window.heap?.identify) {
        window.heap.identify(userId);

        const props: Record<string, string> = {};
        if (role) props.role = role;
        if (authProvider) props.auth_provider = authProvider;
        if (Object.keys(props).length > 0) {
          window.heap.addUserProperties(props);
        }
      } else if (tries++ < 50) {
        timer = window.setTimeout(run, 100); // wait for GTM to inject Heap
      }
    };

    run();
    return () => window.clearTimeout(timer);
  }, [userId, role, authProvider]);

  return null;
}
