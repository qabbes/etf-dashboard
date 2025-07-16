import type { DateRange } from "@/lib/utils";
import type { ETFDataPoint } from "@/types/etf.types";



interface Props {
    data: ETFDataPoint[];
    selectedRange?: DateRange;
    isLoading?: boolean;
}

function getPerformance(data: ETFDataPoint[]): number | null {
  if (!data || data.length < 2) return null;

  const first = data[0].price;
  const last = data[data.length - 1].price;

  if (first === 0) return null;
  return ((last - first) / first) * 100;
}
  

const PerformanceSummary = ({data, selectedRange, isLoading}: Props) => {
  if (isLoading ||!data?.length) return null;
	
  const lastPrice = data[data.length - 1].price;
  const perf = getPerformance(data);

  return (
    <div className="flex flex-col items-start gap-1 text-base font-medium pt-3">
      <span className="text-4xl font-semibold tabular-nums items-center md:pl-2">{lastPrice.toFixed(2)}€</span>
      {perf !== null && (
        <span className="text-gray-500 text-sm">
          Last {selectedRange === "week" ? "7 days" : selectedRange} :
          <span className={perf >= 0 ? "text-green-600" : "text-red-600"}>
			<span className="text-2xl font-semibold">
              {perf >= 0 ? " +" : " "}
              {perf.toFixed(2)}%
			</span>
          </span>
        </span>
      )}
    </div>
  );
}

export default PerformanceSummary