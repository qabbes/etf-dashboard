
export default function ChartSkeleton() {
  return (
    <div className="w-3/4 rounded-xl border bg-background shadow-sm p-4">
      <div className="h-6 w-1/3 mb-4 relative overflow-hidden rounded-md bg-muted">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
      <div className="h-[240px] w-full relative overflow-hidden rounded-md bg-muted">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    </div>
  );
}


