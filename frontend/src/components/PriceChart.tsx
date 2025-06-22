import { TICKER_OPTIONS } from "@/config/constants";
import { formatTooltipTimestamp } from "@/lib/chartUtils";
import { determineDateRange, formatTimestamp,  type DateRange } from "@/lib/utils";
import type { ETFDataPoint } from "@/types/etf.types";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,CartesianGrid} from "recharts";
import AsideCard from "./AsideCard";

  interface PriceChartProps {
  data: ETFDataPoint[];
  selectedRange?: DateRange;
  yDomain: [number, number];
  ticker: string;
  setTicker: (value: string) => void;
}


export default function PriceChart({ data,selectedRange, yDomain, ticker, setTicker }: PriceChartProps) {
  const [dateRange, setDateRange] = useState<DateRange>('month');
  
  
  const selectedETF = TICKER_OPTIONS.find((opt) => opt.value === ticker);

    useEffect(() => {
    if (selectedRange) {
      setDateRange(selectedRange);
    } else if (data.length > 0) {
      // Auto-determine the range based on data
      const dates = data.map(point => point.date || new Date(point.timestamp));
      setDateRange(determineDateRange(dates));
    }
  }, [data, selectedRange]);

    return (
      <>
        <div className="w-3/4 rounded-xl border bg-background shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold mb-4">
              {selectedETF ? `Price History for ${selectedETF.label}` : ""}
            </h2>
            <AsideCard tracker={ticker} setTracker={setTicker} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {data.length > 0 ? (
              <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <defs>
                  <linearGradient id="fillSP500" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillSTOXX50" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value: string) => formatTimestamp(value, dateRange)}
                  tickMargin={8}
                  minTickGap={32}
                />
                <YAxis domain={yDomain} tickFormatter={(value) => value.toFixed(2)} />
                <Tooltip
                  labelFormatter={formatTooltipTimestamp}
                  formatter={(value) => [`${value}€`, "Price"]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <div className="p-4 text-center">
                No data available for the selected time range. Try selecting a wider range like
                "week" or "month".
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </>
    );
  }