import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TICKER_OPTIONS } from "@/config/constants";

type Props = {
    tracker: string;
    setTracker: (value: string) => void;
}

const AsideCard = ({tracker, setTracker} : Props) => {
    const handleValueChange = (value: string) => {
        if (value) {
          setTracker(value);
        }
    }
    return (
      <div>
        <ToggleGroup
          type="single"
          value={tracker}
          onValueChange={handleValueChange}
          variant="outline">
          {TICKER_OPTIONS.map(({ label, value }) => (
            <ToggleGroupItem key={value} className="px-5" value={value}>
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    );
    }

export default AsideCard