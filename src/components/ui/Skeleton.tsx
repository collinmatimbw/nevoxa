export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-gray-200/60 dark:bg-gray-800/60 ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200/60 dark:border-gray-700/40 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200/60 dark:border-gray-700/40 p-6">
      <Skeleton className="h-5 w-44 mb-2" />
      <Skeleton className="h-3 w-28 mb-6" />
      <Skeleton className="h-[280px] w-full rounded-xl" />
    </div>
  );
}
