
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DateRange } from "@/lib/utils";

interface ChartHeaderProps {
    timeRange: string;
    setTimeRange: (value: DateRange) => void;
    }

const ChartHeader = ({timeRange, setTimeRange}: ChartHeaderProps ) => {
  return (
    <Card> 
        <CardHeader className="flex items-center gap-2 space-y-0 py-3">
            <div className="grid flex-1 gap-1">
            <CardTitle>ETF Performance Overview</CardTitle>
            <CardDescription className="pb-0">
                Analyze the performance of your selected ETF over last {timeRange ? timeRange : "period"}.
            </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto sm:flex"
                aria-label="Select a value"
            >
                <SelectValue placeholder="Last year" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="year" className="rounded-lg">
                Last year
                </SelectItem>
                <SelectItem value="month" className="rounded-lg">
                Last 30 days
                </SelectItem>
                <SelectItem value="week" className="rounded-lg">
                Last 7 days
                </SelectItem>
                <SelectItem value="day" className="rounded-lg">
                Last 24h
                </SelectItem>
            </SelectContent>
            </Select>
        </CardHeader>
      </Card>
  )
}

export default ChartHeader