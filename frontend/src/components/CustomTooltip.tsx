import { formatTooltipTimestamp } from "@/lib/chartUtils";
import type { TooltipProps } from "recharts";

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card p-4 rounded-lg shadow-lg bg-card text-card-foreground">
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        {formatTooltipTimestamp(label as string)}
      </div>
      <div>
        <span style={{ marginLeft: 1, color: "#888" }}>Price: </span>
        <span style={{ color: "#f0b101", fontWeight: 700 }}>{payload[0].value}€</span>
      </div>
    </div>
  );
};
export default CustomTooltip;