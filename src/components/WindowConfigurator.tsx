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
}

const WindowConfigurator = ({ onAddWindow }: WindowConfiguratorProps) => {
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('single-hung');
  const [showSubOption, setShowSubOption] = useState(false);

  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
    setShowSubOption(value === 'casement' || value === 'horizontal-roller');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const color = formData.get('color') as string;
    
    const window: WindowConfig = {
      type: 'window',
      color: color === 'custom' ? formData.get('customColor') as string : color,
      material: formData.get('material') as string,
      width: formData.get('width') as string,
      height: formData.get('height') as string,
      style: formData.get('style') as string,
      subOption: formData.get('subOption') as string,
    };
    onAddWindow(window);
    (e.target as HTMLFormElement).reset();
    setShowCustomColor(false);
    setShowSubOption(false);
    setSelectedStyle('single-hung');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Window Configurator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color">Window Color:</Label>
            <Select 
              name="color" 
              defaultValue="bronze"
              onValueChange={(value) => setShowCustomColor(value === 'custom')}
            >
              <SelectTrigger>
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
              <Input type="text" id="customColor" name="customColor" required placeholder="Enter custom color" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="material">Material:</Label>
            <Select name="material" defaultValue="aluminum">
              <SelectTrigger>
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
            <Label htmlFor="width">Width (in inches):</Label>
            <Input type="number" id="width" name="width" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (in inches):</Label>
            <Input type="number" id="height" name="height" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Window Style:</Label>
            <Select name="style" defaultValue="single-hung" onValueChange={handleStyleChange}>
              <SelectTrigger>
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

          {showSubOption && selectedStyle === 'casement' && (
            <div className="space-y-2">
              <Label>Casement Option:</Label>
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
              <Label>Roller Option:</Label>
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

          <Button type="submit" className="w-full">Add Window to List</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WindowConfigurator;