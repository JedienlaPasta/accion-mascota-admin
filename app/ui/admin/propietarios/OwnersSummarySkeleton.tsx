'use client';

export default function OwnersSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-7 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex min-w-0 flex-col justify-center gap-1">
        <div className="h-3 w-20 grow animate-pulse rounded bg-gray-200"></div>
        <div className="h-5 w-28 grow animate-pulse rounded-md bg-gray-200"></div>
      </div>

      <div className="flex size-11 shrink-0 animate-pulse items-center justify-center rounded-xl bg-gray-200"></div>
    </div>
  );
}
