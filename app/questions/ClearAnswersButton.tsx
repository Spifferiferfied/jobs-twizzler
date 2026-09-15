"use client";

import { useTransition } from "react";
import { clearMyAnswers } from "./actions";

export default function ClearAnswersButton() {
  const [pending, startTransition] = useTransition();

  function onClick() {
    const ok = window.confirm(
      "Clear all of your answers? This permanently deletes your votes (removing them from the totals) so you can answer everything again.",
    );
    if (!ok) return;

    startTransition(async () => {
      const res = await clearMyAnswers();
      if (res.error) {
        window.alert(res.error);
      } else {
        window.alert(`Cleared ${res.cleared ?? 0} answer(s).`);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="px-4 py-2 rounded-lg border-2 border-secondary bg-secondary-dark font-bold hover:bg-secondary-dark/60 transition-colors disabled:opacity-50"
    >
      {pending ? "Clearing…" : "Clear my answers"}
    </button>
  );
}
