export default function ChartSkeleton() {
  return (
    <div className="w-full rounded-xl border bg-card text-card-foreground shadow-sm p-2">
      <div className="flex justify-between items-center mb-4 p-4">
        <div className="space-y-2">
          {/* Title skeleton */}
          <div className="h-6 w-48 relative overflow-hidden rounded-md bg-muted">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          {/* Performance Summary skeleton */}
          <div className="flex flex-col items-start gap-1 pt-3">
            {/* Price skeleton */}
            <div className="h-10 w-32 relative overflow-hidden rounded-md bg-muted">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
            {/* Performance percentage skeleton */}
            <div className="h-6 w-24 relative overflow-hidden rounded-md bg-muted mt-1">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
        </div>
        {/* Toggle group skeleton */}
        <div className="h-10 w-[360px] relative overflow-hidden rounded-md bg-muted">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>

      {/* Chart area skeleton */}
      <div className="h-[300px] w-full relative overflow-hidden rounded-md bg-muted">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    </div>
  );
}
