export default function Loading() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="border-2 border-secondary rounded-lg p-4 bg-secondary-dark">
        <div className="h-7 w-3/4 rounded bg-tertiary/30 mb-4" />
        <div className="h-4 w-24 rounded bg-tertiary/30" />
      </div>
      <div className="flex gap-4">
        <div className="h-14 flex-1 rounded-lg border-2 border-secondary bg-secondary-dark" />
        <div className="h-14 flex-1 rounded-lg border-2 border-secondary bg-secondary-dark" />
      </div>
    </div>
  );
}
