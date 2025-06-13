import type { DateRange } from "@/lib/utils";
import { useEffect, useState } from "react";

export const useChartDateRange = () => {
  const [timeRange, setTimeRange] = useState<DateRange>('month');

  useEffect(() => {
    console.log(`Current time range: ${timeRange}`);
  }, [timeRange]);

  return { timeRange, setTimeRange };
}