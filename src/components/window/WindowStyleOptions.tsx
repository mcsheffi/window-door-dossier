import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WindowStyleOptionsProps {
  selectedStyle: string;
  showSubOption: boolean;
  showDoorOptions: boolean;
}

const WindowStyleOptions = ({ selectedStyle, showSubOption, showDoorOptions }: WindowStyleOptionsProps) => {
  if (!showSubOption && !showDoorOptions) return null;

  if (selectedStyle === 'casement') {
    return (
      <div className="space-y-2">
        <Label className="text-charcoal-foreground">Casement Option:</Label>
        <RadioGroup defaultValue="left" name="subOption">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="left" />
            <Label htmlFor="left">Left Hinge</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="right" />
            <Label htmlFor="right">Right Hinge</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stationary" id="stationary" />
            <Label htmlFor="stationary">Stationary</Label>
          </div>
        </RadioGroup>
      </div>
    );
  }

  if (selectedStyle === 'horizontal-roller') {
    return (
      <div className="space-y-2">
        <Label className="text-charcoal-foreground">Roller Option:</Label>
        <RadioGroup defaultValue="left-active" name="subOption">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left-active" id="left-active" />
            <Label htmlFor="left-active">Left Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right-active" id="right-active" />
            <Label htmlFor="right-active">Right Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="three-panel" id="three-panel" />
            <Label htmlFor="three-panel">3 Panel</Label>
          </div>
        </RadioGroup>
      </div>
    );
  }

  if (selectedStyle === 'sliding-glass-door' || selectedStyle === 'swing-door') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="numberOfPanels" className="text-charcoal-foreground">Number of Panels:</Label>
          <Input
            type="number"
            id="numberOfPanels"
            name="numberOfPanels"
            min="1"
            required
            className="bg-[#403E43] text-charcoal-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pocketType" className="text-charcoal-foreground">Configuration Type:</Label>
          <Select name="pocketType" defaultValue="standard">
            <SelectTrigger className="bg-[#403E43]">
              <SelectValue placeholder="Select configuration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="pocket">Pocket</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stackType" className="text-charcoal-foreground">Stack Type:</Label>
          <Select name="stackType" defaultValue="standard">
            <SelectTrigger className="bg-[#403E43]">
              <SelectValue placeholder="Select stack type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Stack</SelectItem>
              <SelectItem value="reverse">Reverse Stack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return null;
};

export default WindowStyleOptions;