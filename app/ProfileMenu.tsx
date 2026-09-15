"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { signOut } from "@/app/auth/login/actions";
import { clearMyAnswers } from "@/app/questions/actions";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function unanswer() {
    const ok = window.confirm(
      "Clear all of your answers? This permanently deletes your votes (removing them from the totals) so you can answer everything again.",
    );
    if (!ok) return;
    startTransition(async () => {
      const res = await clearMyAnswers();
      setOpen(false);
      window.alert(res.error ?? `Cleared ${res.cleared ?? 0} answer(s).`);
    });
  }

  const itemClass =
    "block w-full text-left px-4 py-3 font-medium hover:bg-primary/20 transition-colors disabled:opacity-50";

  return (
    <nav ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
      >
        <Image
          src="/icons/profile.svg"
          alt=""
          width={32}
          height={32}
          priority
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Profile"
          className="absolute -right-4 mt-2 p-4 w-[75dvw] md:w-56 overflow-hidden bg-secondary-dark shadow-lg z-50 starting:max-h-0 transition-[max-height max-h-screen duration-150 ease-in"
        >
          <Link
            href="/questions/new"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            Add Question
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={unanswer}
            disabled={pending}
            className={itemClass}
          >
            {pending ? "Clearing…" : "Unanswer Questions"}
          </button>
          <div className="border-t border-secondary/30" />
          <form action={signOut}>
            <button type="submit" role="menuitem" className={itemClass}>
              Sign Out
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
