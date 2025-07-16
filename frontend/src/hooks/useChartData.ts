import { filterByDateRange, getYAxisDomain, paddingMap } from "@/lib/chartUtils";
import type { DateRange } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useETFDataQuery } from "./useETFDataQuery";


export function useChartData(dataKey: string) {
  const [timeRange, setTimeRange] = useState<DateRange>("month");
  const {data: rawData = [], isLoading} = useETFDataQuery(dataKey);
  const [animatedData, setAnimatedData] = useState(rawData);

    const filteredData = useMemo(
    () => filterByDateRange(rawData, timeRange),
    [rawData, timeRange]
  );
  
  // Handle data transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(filteredData);
    }, );
    return () => clearTimeout(timer);
  }, [filteredData]);

  const yDomain = useMemo(() => getYAxisDomain(filteredData, paddingMap[timeRange] || 0.05),
    [filteredData, timeRange]
  );



  return {
    filteredData : animatedData,
    yDomain,
    timeRange,
    setTimeRange,
    isLoading,
  };
}