import { TICKER_OPTIONS } from "@/config/constants";
import { useIsMobile } from "@/hooks/useIsMobile";
import { determineDateRange, formatTimestamp, type DateRange } from "@/lib/utils";
import type { ETFDataPoint } from "@/types/etf.types";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AsideCard from "./AsideCard";
import CustomTooltip from "./CustomTooltip";
import CustomYAxisTick from "./CustomYAxisTick";
import PerformanceSummary from "./PerformanceSummary";

  interface PriceChartProps {
  data: ETFDataPoint[];
  selectedRange?: DateRange;
  yDomain: [number, number];
  ticker: string;
  setTicker: (value: string) => void;
}




export default function PriceChart({ data,selectedRange, yDomain, ticker, setTicker }: PriceChartProps) {
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const isMobile = useIsMobile();

  const selectedETF = TICKER_OPTIONS.find((opt) => opt.value === ticker);

  useEffect(() => {
    if (selectedRange) {
      setDateRange(selectedRange);
    } else if (data.length > 0) {
      // Auto-determine the range based on data
      const dates = data.map((point) => point.date || new Date(point.timestamp));
      setDateRange(determineDateRange(dates));
    }
  }, [data, selectedRange]);
  //bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm
  return (
    <>
      <div className="w-full rounded-xl border bg-card text-card-foreground shadow-sm p-2">
        {isMobile ? (
          <div className="flex flex-col justify-between mb-4 p-4">
            <AsideCard
              tracker={ticker}
              setTracker={setTicker}
              classname="flex items-center justify-center pb-3"
              isMobile={isMobile}
            />
            <h2 className="text-sm text-muted-foreground">
              {selectedETF ? `Performance for ${selectedETF.label}` : ""}
            </h2>
            <PerformanceSummary data={data} selectedRange={selectedRange} />
          </div>
        ) : (
          <div className="flex justify-between items-center mb-4 p-4">
            <div className="flex flex-col items-start">
              <h2 className="text-lg font-semibold">
                {selectedETF ? `Performance for ${selectedETF.label}` : ""}
              </h2>
              <PerformanceSummary data={data} selectedRange={selectedRange} />
            </div>
            <AsideCard tracker={ticker} setTracker={setTicker} />
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          {data.length > 0 ? (
            <AreaChart
              data={data}
              margin={
                isMobile
                  ? { top: 5, right: 0, bottom: 20, left: 0 }
                  : { top: 5, right: 20, bottom: 20, left: 8 }
              }>
              <defs>
                <linearGradient id="fillSP500" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={1.0} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillSTOXX50" x1="0" y1="0" x2="0" y2="2">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                horizontal={!isMobile}
                stroke="var(--color-grid-horizontal)"
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value: string) => formatTimestamp(value, dateRange)}
                tickMargin={8}
                minTickGap={32}
              />
              <YAxis
                domain={yDomain}
                tickFormatter={(value) => value.toFixed(2)}
                tick={(props) => (
                  <CustomYAxisTick
                    {...props}
                    isMobile={isMobile}
                    dy={4}
                    textAnchor="end"
                    fill="#666"
                  />
                )}
                tickLine={!isMobile}
                hide={isMobile}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="var(--color-chart-1)"
                fill="url(#fillSP500)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <div className="p-4 text-center">
              No data available for the selected time range. Try selecting a wider range like "week"
              or "month".
            </div>
          )}
        </ResponsiveContainer>
      </div>
    </>
  );
}