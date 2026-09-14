"use client";

import { Button } from "@radix-ui/themes";
import { useTransition } from "react";
import { submitVote } from "./actions";

type Props = {
  questionId: number;
  isLine: boolean;
};

export default function VoteButtons({ questionId, isLine }: Props) {
  const [isPending, startTransition] = useTransition();

  function vote(answer: boolean) {
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
        className=" text-center flex-1 py-4 rounded-lg border-2 border-secondary bg-primary font-bold hover:bg-primary/80 hover:text-white transition-colors disabled:opacity-50"
      >
        {isLine ? `Over` : "Yes"}
      </Button>
      <Button
        type="button"
        disabled={isPending}
        onClick={() => vote(false)}
        className="text-center flex-1 py-4 rounded-lg border-2 border-secondary bg-primary font-bold hover:bg-primary/80 hover:text-white transition-colors disabled:opacity-50"
      >
        {isLine ? `Under` : "No"}
      </Button>
    </div>
  );
}
