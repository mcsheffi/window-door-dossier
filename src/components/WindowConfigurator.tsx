import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WindowMeasurements from "./window/WindowMeasurements";
import WindowStyleOptions from "./window/WindowStyleOptions";

interface WindowConfiguratorProps {
  onAddWindow: (window: WindowConfig) => void;
}

export interface WindowConfig {
  type: 'window';
  color: string;
  customColor?: string;
  material: string;
  width: string;
  height: string;
  style: string;
  subOption?: string;
  measurementGiven: string;
  openingPhoto?: File;
  notes?: string;
  // New door specific options
  numberOfPanels?: string;
  stackType?: string;
  pocketType?: string;
}

const WindowConfigurator = ({ onAddWindow }: WindowConfiguratorProps) => {
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('single-hung');
  const [showSubOption, setShowSubOption] = useState(false);
  const [showDoorOptions, setShowDoorOptions] = useState(false);
  const [openingPhoto, setOpeningPhoto] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('bronze');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('aluminum');
  const [customColor, setCustomColor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [measurementGiven, setMeasurementGiven] = useState<string>('dlo');

  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
    setShowSubOption(value === 'casement' || value === 'horizontal-roller');
    setShowDoorOptions(value === 'sliding-glass-door' || value === 'swing-door');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOpeningPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const window: WindowConfig = {
      type: 'window',
      color: selectedColor === 'custom' ? customColor : selectedColor,
      material: selectedMaterial,
      width: formData.get('width') as string,
      height: formData.get('height') as string,
      style: formData.get('style') as string,
      subOption: formData.get('subOption') as string,
      measurementGiven: formData.get('measurementGiven') as string,
      openingPhoto: openingPhoto || undefined,
      notes: notes || undefined,
      numberOfPanels: formData.get('numberOfPanels') as string,
      stackType: formData.get('stackType') as string,
      pocketType: formData.get('pocketType') as string,
    };
    onAddWindow(window);
    (e.target as HTMLFormElement).reset();
    setShowSubOption(false);
    setShowDoorOptions(false);
    setSelectedStyle('single-hung');
    setOpeningPhoto(null);
    setNotes('');
  };

  return (
    <Card className="mb-6 bg-charcoal text-charcoal-foreground">
      <CardHeader>
        <CardTitle>Window Configurator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color" className="text-charcoal-foreground">Window Color:</Label>
            <Select 
              name="color" 
              value={selectedColor}
              onValueChange={(value) => {
                setSelectedColor(value);
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
                onChange={(e) => setCustomColor(e.target.value)}
                required 
                placeholder="Enter custom color" 
                className="bg-[#403E43] text-charcoal-foreground" 
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="material" className="text-charcoal-foreground">Material:</Label>
            <Select 
              name="material" 
              value={selectedMaterial}
              onValueChange={setSelectedMaterial}
            >
              <SelectTrigger className="bg-[#403E43]">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluminum">Aluminum</SelectItem>
                <SelectItem value="vinyl">Vinyl</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style" className="text-charcoal-foreground">Window Style:</Label>
            <Select name="style" value={selectedStyle} onValueChange={handleStyleChange}>
              <SelectTrigger className="bg-[#403E43]">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-hung">Single-Hung</SelectItem>
                <SelectItem value="awning">Awning</SelectItem>
                <SelectItem value="casement">Casement</SelectItem>
                <SelectItem value="double-hung">Double-Hung</SelectItem>
                <SelectItem value="fixed">Fixed Window</SelectItem>
                <SelectItem value="horizontal-roller">Horizontal Roller</SelectItem>
                <SelectItem value="sliding-glass-door">Sliding Glass Door</SelectItem>
                <SelectItem value="swing-door">Swing Door</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <WindowMeasurements
            measurementGiven={measurementGiven}
            onMeasurementChange={setMeasurementGiven}
          />

          <WindowStyleOptions
            selectedStyle={selectedStyle}
            showSubOption={showSubOption}
            showDoorOptions={showDoorOptions}
          />

          <div className="space-y-2">
            <Label htmlFor="openingPhoto" className="text-charcoal-foreground">Opening Photo:</Label>
            <Input 
              type="file" 
              id="openingPhoto" 
              accept="image/*;capture=camera"
              onChange={handlePhotoChange}
              className="bg-[#403E43] text-charcoal-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-charcoal-foreground">Notes:</Label>
            <Input 
              type="text" 
              id="notes" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes here" 
              className="bg-[#403E43] text-charcoal-foreground" 
            />
          </div>

          <Button type="submit" className="w-full">Add Window to List</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WindowConfigurator;