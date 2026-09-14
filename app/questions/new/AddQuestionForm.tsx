"use client";

import { useActionState, useState } from "react";
import { type CreateQuestionState, createQuestion } from "./actions";

const initialState: CreateQuestionState = {};

const inputClass =
  "bg-secondary-dark border-2 border-secondary rounded-lg px-3 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-tertiary";

export default function AddQuestionForm() {
  const [state, formAction, pending] = useActionState(
    createQuestion,
    initialState,
  );
  const [type, setType] = useState<"yes/no" | "over/under">("yes/no");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="font-bold">Question</span>
        <textarea
          name="question"
          required
          rows={3}
          placeholder="e.g. Will it rain here before midnight?"
          className={inputClass}
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-bold mb-2">Type</legend>
        <div className="flex gap-3">
          {(["yes/no", "over/under"] as const).map((t) => (
            <label
              key={t}
              className={`flex-1 text-center py-2 rounded-lg border-2 cursor-pointer transition-colors ${
                type === t
                  ? "border-secondary bg-primary font-bold"
                  : "border-secondary/40 bg-secondary-dark text-foreground/70"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
              />
              {t === "yes/no" ? "Yes / No" : "Over / Under"}
            </label>
          ))}
        </div>
      </fieldset>

      {type === "over/under" && (
        <label className="flex flex-col gap-2">
          <span className="font-bold">Line</span>
          <input
            name="line"
            type="text"
            placeholder="e.g. 3.5 inches"
            className={inputClass}
          />
        </label>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked
          className="w-4 h-4 accent-primary"
        />
        <span className="font-bold">Enabled (visible in the list)</span>
      </label>

      {state.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="py-3 rounded-lg border-2 border-secondary bg-primary font-bold hover:bg-primary/80 hover:text-white transition-colors disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add question"}
      </button>
    </form>
  );
}
