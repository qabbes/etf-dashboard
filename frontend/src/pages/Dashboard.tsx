import ChartHeader from "@/components/ChartHeader";
import ChartSkeleton from "@/components/ChartSkeleton";
import { ModeToggle } from "@/components/ModeToggle";
import PriceChart from "@/components/PriceChart";
import { useChartData } from "@/hooks/useChartData";
import { useState } from "react";

export default function Dashboard() {

  const [ticker, setTicker] = useState<string>("ESE.PA.json");
  const { filteredData, yDomain, timeRange, setTimeRange, isLoading, rawData } =
    useChartData(ticker);


  return (
    <>
      <div className="flex justify-end py-4 px-6">
        <ModeToggle/>
      </div>
      <div className="w-full md:w-5/7 mx-auto">
      <ChartHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      <div className="flex justify-between gap-4 mt-4">
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <PriceChart
            data={filteredData}
            ticker={ticker}
            setTicker={setTicker}
            selectedRange={timeRange}
            yDomain={yDomain}
            isLoading={isLoading}
            rawData={rawData}
          />
        )}
        </div>
      </div>
    </>
  );
}
