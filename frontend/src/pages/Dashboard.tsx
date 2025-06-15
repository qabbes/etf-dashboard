import ChartHeader from "@/components/ChartHeader";
import PriceChart from "@/components/PriceChart";
import { SP500_DATA_KEY } from "@/config/constants";
import { useChartData } from "@/hooks/useChartData";

export default function Dashboard() {
  const {filteredData, yDomain, timeRange, setTimeRange, isLoading} = useChartData(SP500_DATA_KEY);

  return (
    <div className="p-4">
      <ChartHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      {isLoading ? (
        <div className="text-sm text-muted">Loading chart data…</div>
      ) : (
        filteredData.length > 0 ? (
          <PriceChart data={filteredData} selectedRange={timeRange} yDomain={yDomain} />
        ) : (
          <div className="p-4 text-center">
            No data available for the selected time range. 
            Try selecting a wider range like "week" or "month".
          </div>
        )
      )}
    </div>
  );
}