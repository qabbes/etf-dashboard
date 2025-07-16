import { fetchPriceData } from "@/services/price.service";
import { useQuery } from "@tanstack/react-query";

export function useETFDataQuery(ticker: string) {
    return useQuery({
        queryKey: ['etfData', ticker],
        queryFn: async () => fetchPriceData(ticker),
        staleTime: 1000 * 60 * 15, // 15 minutes
    });
    }