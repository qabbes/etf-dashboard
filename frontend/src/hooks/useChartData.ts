import { useEffect, useState } from "react";
import { fetchPriceData } from "@/services/price.service";
import type { DateRange } from "@/lib/utils";
import type { ETFDataPoint } from "@/types/etf.types";
import { filterByDateRange, getYAxisDomain } from "@/lib/chartUtils";


export function 
useChartData(dataKey: string) {
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

  const filteredData = filterByDateRange(rawData, timeRange) ?? [];

  const paddingMap = { day: 0.01, week: 0.05, month: 0.09, year: 0.1 };
  const yDomain = getYAxisDomain(filteredData, paddingMap[timeRange] || 0.05); 

  return {
    rawData,
    filteredData,
    yDomain,
    timeRange,
    setTimeRange,
    isLoading,
  };
}