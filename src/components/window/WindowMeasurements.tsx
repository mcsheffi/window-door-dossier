import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WindowMeasurementsProps {
  measurementGiven: string;
  onMeasurementChange: (value: string) => void;
}

const WindowMeasurements = ({ measurementGiven, onMeasurementChange }: WindowMeasurementsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="measurementGiven" className="text-charcoal-foreground">Measurement Given:</Label>
        <Select name="measurementGiven" value={measurementGiven} onValueChange={onMeasurementChange}>
          <SelectTrigger className="bg-[#403E43]">
            <SelectValue placeholder="Select measurement type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dlo">DLO</SelectItem>
            <SelectItem value="rough">Rough Opening</SelectItem>
            <SelectItem value="masonry">Masonry Opening</SelectItem>
            <SelectItem value="frame">Frame Size</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="width" className="text-charcoal-foreground">Width (in inches):</Label>
        <Input type="number" id="width" name="width" required className="bg-[#403E43] text-charcoal-foreground" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="height" className="text-charcoal-foreground">Height (in inches):</Label>
        <Input type="number" id="height" name="height" required className="bg-[#403E43] text-charcoal-foreground" />
      </div>
    </>
  );
};

export default WindowMeasurements;