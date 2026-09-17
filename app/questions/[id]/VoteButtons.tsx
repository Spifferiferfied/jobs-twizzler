"use client";

import { Button } from "@radix-ui/themes";
import { useState, useTransition } from "react";
import { submitVote } from "./actions";

type Props = {
  questionId: number;
  isLine: boolean;
};

export default function VoteButtons({ questionId, isLine }: Props) {
  const [isPending, startTransition] = useTransition();
  const [answer, setAnswer] = useState<boolean | null>(null);

  function vote(answer: boolean) {
    setAnswer(answer);
    startTransition(async () => {
      const result = await submitVote(questionId, answer);
      if (result.error) {
        alert(result.error);
      }
    });
  }

  return (
    <div className="flex gap-4">
      <Button
        type="button"
        disabled={isPending}
        onClick={() => vote(true)}
        className={`loading-btn text-center flex-1 py-4 rounded-lg border-2 border-secondary bg-primary font-bold hover:bg-primary/80 hover:text-white transition-colors disabled:opacity-50 ${answer === true ? "active" : ""}`}
      >
        {isLine ? `Over` : "Yes"}
      </Button>
      <Button
        type="button"
        disabled={isPending}
        onClick={() => vote(false)}
        className={`loading-btn text-center flex-1 py-4 rounded-lg border-2 border-secondary bg-primary font-bold hover:bg-primary/80 hover:text-white transition-colors disabled:opacity-50 ${answer === false ? "active" : ""}`}
      >
        {isLine ? `Under` : "No"}
      </Button>
    </div>
  );
}
