import type { ETFDataPoint } from "@/types/etf.types";
import type { DateRange } from "./utils";

export const paddingMap = { day: 0.01, week: 0.05, month: 0.09, year: 0.1 };

export function filterByDateRange(data: ETFDataPoint[], range: DateRange): ETFDataPoint[] {
  const daysMap: Record<DateRange, number> = { day: 1, week: 7, month: 30, year: 365 };
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysMap[range]);

  return data.filter((point) => {
    const pointDate = new Date(point.timestamp);
    return pointDate >= cutoff;
  });
}

export function formatTooltipTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    // Format: "Mon, Jun 15 - 14:30"
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      
      month: 'short',
      day: 'numeric',
    }) + ' - ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      
      hour12: false
    }) +'h';
  }

  export function getYAxisDomain(
    data: { price: number }[], paddingPercent: number): [number, number] {
    if (data.length === 0) return [0, 1]; // fallback

    const prices = data.map((d) => d.price);
    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);

    console.log(`Calculating Y-axis domain: min=${rawMin}, max=${rawMax}, paddingPercent=${paddingPercent}`);
    
     // Calculate padding based on the raw range first
    const rawRange = rawMax - rawMin || rawMin * 0.01 || 1;
    const padding = rawRange * paddingPercent;
    
    // Add padding
    const paddedMin = rawMin - padding;
    const paddedMax = rawMax + padding;

    // Round AFTER padding is applied
    const roundedMin = Math.floor(paddedMin * 20) / 20; // round down to nearest 0.05
    const roundedMax = Math.ceil(paddedMax * 20) / 20;  // round up to nearest 0.05
    
    return [roundedMin, roundedMax];
  }