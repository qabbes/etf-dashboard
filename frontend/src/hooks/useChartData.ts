import { useEffect, useMemo, useState } from "react";
import { fetchPriceData } from "@/services/price.service";
import type { DateRange } from "@/lib/utils";
import type { ETFDataPoint } from "@/types/etf.types";
import { filterByDateRange, getYAxisDomain, paddingMap } from "@/lib/chartUtils";


export function useChartData(dataKey: string) {
  const [timeRange, setTimeRange] = useState<DateRange>("month");
  const [rawData, setRawData] = useState<ETFDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchPriceData(dataKey)
      .then((data) => {
        setRawData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load price data:", err);
        setIsLoading(false);
      });
  }, [dataKey]);

  const filteredData = useMemo(() => filterByDateRange(rawData, timeRange),
    [rawData, timeRange]
  );
  
  const yDomain = useMemo(() => getYAxisDomain(filteredData, paddingMap[timeRange] || 0.05),
    [filteredData, timeRange]
  );

  return {
    rawData,
    filteredData,
    yDomain,
    timeRange,
    setTimeRange,
    isLoading,
  };
}