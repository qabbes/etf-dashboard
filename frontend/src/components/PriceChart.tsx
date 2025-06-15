import { formatTooltipTimestamp } from "@/lib/chartUtils";
import { determineDateRange, formatTimestamp,  type DateRange } from "@/lib/utils";
import type { ETFDataPoint } from "@/types/etf.types";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,CartesianGrid} from "recharts";

  interface PriceChartProps {
  data: ETFDataPoint[];
  selectedRange?: DateRange;
  yDomain: [number, number];
}


export default function PriceChart({ data, selectedRange, yDomain }: PriceChartProps) {
  const [dateRange, setDateRange] = useState<DateRange>('month');
  

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
      <div className="rounded-xl bg-white dark:bg-black p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">Price History</h2>
        <ResponsiveContainer width="80%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value: string) => formatTimestamp(value, dateRange)}
              tickMargin={8}
              minTickGap={32}/>
            <YAxis 
              domain={yDomain}
              tickFormatter={(value) => value.toFixed(2)} />
            <Tooltip 
              labelFormatter={formatTooltipTimestamp}
              formatter={(value) => [`${value}€`, 'Price']}
            />
            <Area type="monotone" dataKey="price" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }