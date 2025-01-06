import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WindowStyleOptionsProps {
  selectedStyle: string;
  showSubOption: boolean;
}

const WindowStyleOptions = ({ selectedStyle, showSubOption }: WindowStyleOptionsProps) => {
  if (!showSubOption) return null;

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

  return null;
};

export default WindowStyleOptions;