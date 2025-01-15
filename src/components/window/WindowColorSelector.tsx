import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WindowColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
}

const WindowColorSelector = ({
  selectedColor,
  onColorChange,
  customColor,
  onCustomColorChange
}: WindowColorSelectorProps) => {
  const [showCustomColor, setShowCustomColor] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="color" className="text-charcoal-foreground">Window Color:</Label>
        <Select 
          name="color" 
          value={selectedColor}
          onValueChange={(value) => {
            onColorChange(value);
            setShowCustomColor(value === 'custom');
          }}
        >
          <SelectTrigger className="bg-[#403E43]">
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bronze">Bronze</SelectItem>
            <SelectItem value="black">Black</SelectItem>
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showCustomColor && (
        <div className="space-y-2">
          <Label htmlFor="customColor">Custom Color:</Label>
          <Input 
            type="text" 
            id="customColor" 
            value={customColor}
            onChange={(e) => onCustomColorChange(e.target.value)}
            required 
            placeholder="Enter custom color" 
            className="bg-[#403E43] text-charcoal-foreground" 
          />
        </div>
      )}
    </>
  );
};

export default WindowColorSelector;