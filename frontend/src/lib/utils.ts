import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export type DateRange = 'day' | 'week' | 'month' | 'year';

/**
 * Formats a timestamp string into a human-readable format based on selected range
 */
export function formatTimestamp(timestamp: string, range: DateRange = 'month'): string {
  try {
    const d = new Date(timestamp);
    
    switch (range) {
      case 'day':
        // For hourly view (e.g., "14:30")
        return d.toLocaleTimeString("en-EN", {
          hour: "2-digit",
          hour12: false
        });
      
      case 'week':
        // For daily view with day name (e.g., "Mon 15")
        return d.toLocaleDateString("en-EN", {
          weekday: "short",
          day: "2-digit",
        });
      
      case 'month':
        // For monthly view (e.g., "15 Jun")
        return d.toLocaleDateString("en-EN", {
          month: "short",
          day: "2-digit"
        });
      
      case 'year':
        // For yearly view (e.g., "Jun 2025")
        return d.toLocaleDateString("en-EN", {
          month: "short",
          year: "numeric"
        });
      
      default:
        // Default full format
        return d.toLocaleDateString("en-EN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return timestamp;
  }
}

/**
 * Determines the appropriate date range based on start and end dates
 */
export function determineDateRange(dates: Date[]): DateRange {
  if (!dates.length) return 'month';
  
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const firstDate = sortedDates[0];
  const lastDate = sortedDates[sortedDates.length - 1];
  
  const diffMs = lastDate.getTime() - firstDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  if (diffDays <= 1) return 'day';
  if (diffDays <= 7) return 'week';
  if (diffDays <= 31) return 'month';
  return 'year';
}

/**
 * Parses a timestamp string into a Date object
 * @param timestamp 
 * @returns 
 */
export function parseTimestamp(timestamp: string): Date {
  return new Date(timestamp);
}
