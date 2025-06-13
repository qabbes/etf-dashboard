import { formatTimestamp, parseTimestamp } from "@/lib/utils";
import type { ETFDataPoint } from "@/types/etf.types";



const baseUrl = import.meta.env.VITE_S3_BUCKET_URL || 'https://scraped-etf-data-qabbes.s3.eu-west-3.amazonaws.com/prices';

export async function fetchPriceData(dataKey : string): Promise<ETFDataPoint[]> {
    
  try {
    const res = await fetch(`${baseUrl}/${dataKey}`);
    console.log(`Fetching price data from: ${baseUrl}/${dataKey}`);

    if (!baseUrl) {
      console.warn('S3_BUCKET_URL is undefined, using fallback URL');
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("Invalid data format");

    const formattedData = data.map((dataPoint: ETFDataPoint) => ({
       ...dataPoint,
      formattedDate: formatTimestamp(dataPoint.timestamp),
      date: parseTimestamp(dataPoint.timestamp),
    }));
    console.log("Formatted price data:", formattedData);
    

    return formattedData as ETFDataPoint[];
  } catch (err) {
    console.error("Error fetching price data:", err);
    return [];
  }
}