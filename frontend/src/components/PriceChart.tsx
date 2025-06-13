import { determineDateRange, formatTimestamp, type DateRange } from "@/lib/utils";
import type { ETFDataPoint } from "@/types/etf.types";
import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid,
  } from "recharts";

  interface PriceChartProps {
  data: ETFDataPoint[];
  selectedRange?: DateRange;
}


export default function PriceChart({ data, selectedRange }: PriceChartProps) {
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

  const customTooltipFormatter = (value: string) => {
    return formatTimestamp(value);
  };

    return (
      <div className="rounded-xl bg-white dark:bg-black p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">Price History</h2>
        <ResponsiveContainer width="80%" height={300}>
          <LineChart data={data}margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value: string) => formatTimestamp(value, dateRange)}
              tickMargin={8}
              minTickGap={32}/>
            <YAxis />
            <Tooltip 
              labelFormatter={customTooltipFormatter}
              formatter={(value) => [`${value}€`, 'Price']}
            />
            <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={{ r: 1 }}
            activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }