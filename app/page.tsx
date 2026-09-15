import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex gap-4 flex-col">
      <h1 className="text-2xl font-bold">Welcome to Impossible Queries!</h1>
      <h2 className="text-lg font-medium italic">
        "Some say it's a waste of time. Others say, an INCREDIBLE waste of
        time."
      </h2>
      <Link
        href="/questions"
        className="px-4 py-2 text-center rounded-lg border-2 border-secondary bg-primary font-bold hover:bg-primary/80 hover:text-white transition-colors"
      >
        The Questions
      </Link>
      <p>
        The smartphone has ruined any semblance of barroom debates. You can have
        almost any bit of information at your fingertips in seconds.
      </p>
      <p>We find that sad.</p>
      <p>
        The premise of this app is to ask questions that are, by and large,
        unanswerable. Dedicated to the innumerable hours spent at Jake&apos;s
        Liquors playing pool with Tommy Coral and Milton Sandler talking about
        these important questions and, of course, the late Princess Diana.
      </p>
      <p>
        The rules are simple: we find random famous persons/events and ask a
        question about it/them that, in theory, cannot be proved.
      </p>
      <p>
        For Example:{" "}
        <span className="italic font-bold">
          Has the Dalai Lama ever eaten a Dorito?
        </span>
      </p>
      <p>
        From there it's a simple "yes" or "no" (or "over" or "under".) Remember,
        it&apos;s not asking if <strong>YOU</strong> have ever eaten a Dorito.
        Use the ubiquity of the human experience as a guide, but know that you
        are <strong>NOT</strong> the Dalai Lama.
      </p>
      <p>
        We plan on updating this list quite a bit, so keep checking back for
        new, important questions
      </p>
      <Link
        href="/questions"
        className="px-4 py-2 text-center rounded-lg border-2 border-secondary bg-primary font-bold hover:bg-primary/80 hover:text-white transition-colors"
      >
        Start Answering
      </Link>
    </div>
  );
}
