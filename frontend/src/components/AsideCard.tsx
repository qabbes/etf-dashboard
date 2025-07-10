import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TICKER_OPTIONS } from "@/config/constants";

type Props = {
    tracker: string;
    setTracker: (value: string) => void;
    classname?: string;
    isMobile?: boolean;
}

const AsideCard = ({tracker, setTracker, classname,isMobile} : Props) => {
    const handleValueChange = (value: string) => {
        if (value) {
          setTracker(value);
        }
    }
    return (
      <div className={classname ? classname : ""}>
        <ToggleGroup
          className="w-[360px] md:w-full flex items-center justify-between"
          type="single"
          value={tracker}
          onValueChange={handleValueChange}
          variant="outline"
          >
          {TICKER_OPTIONS.map(({ label, value }) => (
            <ToggleGroupItem size={isMobile ? "sm" : "default"} key={value} className="md:px-5" value={value}>
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    );
    }

export default AsideCard