import { useEffect, useState } from "react";
import { fetchPriceData,} from "@/services/price.service";
import PriceChart from "@/components/PriceChart";
import type { ETFDataPoint } from "@/types/etf.types";

const dataKey = "ESE.PA.json"; 

export default function Dashboard() {
  const [data, setData] = useState<ETFDataPoint[]>([]);

  useEffect(() => {
    fetchPriceData(dataKey).then(setData);
  }, []);

  return (
    <div className="p-4">
      <PriceChart data={data} />
    </div>
  );
}