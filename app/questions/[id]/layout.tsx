import Image from "next/image";
import Link from "next/link";

export default function QuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 -mt-6">
      <Link className="flex gap-1" href="/questions">
        <Image
          src="/icons/arrow-left.svg"
          className="inline"
          alt="arrow"
          width={4}
          height={8}
        />{" "}
        All Questions
      </Link>
      {children}
    </div>
  );
}
