import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
}

const WindowConfigurator = ({ onAddWindow }: WindowConfiguratorProps) => {
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('single-hung');
  const [showSubOption, setShowSubOption] = useState(false);
  const [openingPhoto, setOpeningPhoto] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('bronze');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('aluminum');
  const [customColor, setCustomColor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
    setShowSubOption(value === 'casement' || value === 'horizontal-roller');
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
    };
    onAddWindow(window);
    (e.target as HTMLFormElement).reset();
    setShowSubOption(false);
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
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurementGiven" className="text-charcoal-foreground">Measurement Given:</Label>
            <Select name="measurementGiven" defaultValue="dlo">
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

          {showSubOption && selectedStyle === 'casement' && (
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
          )}

          {showSubOption && selectedStyle === 'horizontal-roller' && (
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
          )}

          <div className="space-y-2">
            <Label htmlFor="openingPhoto" className="text-charcoal-foreground">Opening Photo (if Available):</Label>
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
