import AsideCard from "@/components/AsideCard";
import ChartHeader from "@/components/ChartHeader";
import PriceChart from "@/components/PriceChart";
import { useChartData } from "@/hooks/useChartData";
import { useState } from "react";

export default function Dashboard() {

  const [ticker, setTicker] = useState<string>("ESE.PA.json");
  const { filteredData, yDomain, timeRange, setTimeRange } = useChartData(ticker);


  return (
    <div className="p-4">
      <ChartHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      <div className="flex justify-between gap-4 mt-4 [&>*:first-child]:w-3/4 [&>*:last-child]:w-1/4">
        <PriceChart data={filteredData} ticker={ticker} selectedRange={timeRange} yDomain={yDomain} />
        <AsideCard tracker={ticker} setTracker={setTicker}/>
      </div>
    </div>
  );
}
