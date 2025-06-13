import type { ETFDataPoint } from "@/types/etf.types";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  } from "recharts";

  export default function PriceChart({ data }: { data: ETFDataPoint[] }) {
    return (
      <div className="rounded-xl bg-white dark:bg-black p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">Price History</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }