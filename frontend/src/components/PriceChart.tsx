import { TICKER_OPTIONS } from "@/config/constants";
import { formatTooltipTimestamp } from "@/lib/chartUtils";
import { determineDateRange, formatTimestamp,  type DateRange } from "@/lib/utils";
import type { ETFDataPoint } from "@/types/etf.types";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,CartesianGrid} from "recharts";

  interface PriceChartProps {
  data: ETFDataPoint[];
  ticker?: string;
  selectedRange?: DateRange;
  yDomain: [number, number];
}


export default function PriceChart({ data, ticker,selectedRange, yDomain }: PriceChartProps) {
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
      <div className="p-4 shadow min-h-[340px]">
        <h2 className="text-lg font-semibold mb-4">
          {selectedETF ? `Price History for ${selectedETF.label}` : ""}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          {data.length > 0 ? (
            <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
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
              No data available for the selected time range. Try selecting a wider range like "week"
              or "month".
            </div>
          )}
        </ResponsiveContainer>
      </div>
    );
  }