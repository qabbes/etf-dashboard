import { useEffect, useState } from "react";
import { fetchPriceData,} from "@/services/price.service";
import PriceChart from "@/components/PriceChart";
import type { ETFDataPoint } from "@/types/etf.types";
import ChartHeader from "@/components/ChartHeader";
import { useChartDateRange } from "@/hooks/useChartDateRange";

const dataKey = "ESE.PA.json"; 

export default function Dashboard() {
  const [data, setData] = useState<ETFDataPoint[]>([]);
  const dateRange = useChartDateRange();

  useEffect(() => {
    fetchPriceData(dataKey).then(setData);
    console.log(`Fetching price data for key: ${data}`);
    
  }, []);

  return (
    <div className="p-4">
      <ChartHeader timeRange={dateRange.timeRange} setTimeRange={dateRange.setTimeRange}/>
      <PriceChart data={data} selectedRange={dateRange.timeRange} />
    </div>
  );
}