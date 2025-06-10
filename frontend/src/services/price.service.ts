
export type PriceData = {
    timestamp: string; 
    price: number; 
};

const baseUrl = import.meta.env.S3_BUCKET_URL;

export async function fetchPriceData(dataKey : string): Promise<PriceData[]> {
    
  try {
    const res = await fetch(`${baseUrl}/${dataKey}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (!Array.isArray(data)) throw new Error("Invalid data format");

    return data as PriceData[];
  } catch (err) {
    console.error("Error fetching price data:", err);
    return [];
  }
}