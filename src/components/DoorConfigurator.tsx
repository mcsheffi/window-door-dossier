import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface DoorConfiguratorProps {
  onAddDoor: (door: DoorConfig) => void;
}

export interface DoorConfig {
  type: 'door';
  width: string;
  height: string;
  handing: string;
  panelType: string;
  slabType: string;
  hardwareType: string;
  measurementGiven: string;
  notes?: string;
  openingPhoto?: File;
  // Make these properties required since they're used in Index.tsx
  color: string;
  material: string;
  style: string;
  customColor?: string;
}

const DoorConfigurator = ({ onAddDoor }: DoorConfiguratorProps) => {
  const [notes, setNotes] = useState<string>('');
  const [openingPhoto, setOpeningPhoto] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('bronze');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('aluminum');
  const [customColor, setCustomColor] = useState<string>('');
  const [showCustomColor, setShowCustomColor] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOpeningPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const door: DoorConfig = {
      type: 'door',
      width: formData.get('width') as string,
      height: formData.get('height') as string,
      handing: formData.get('handing') as string,
      panelType: formData.get('panelType') as string,
      slabType: formData.get('slabType') as string,
      hardwareType: formData.get('hardwareType') as string,
      measurementGiven: formData.get('measurementGiven') as string,
      notes: notes || undefined,
      openingPhoto: openingPhoto || undefined,
      // Add the new properties to the door object
      color: selectedColor === 'custom' ? customColor : selectedColor,
      material: selectedMaterial,
      style: formData.get('slabType') as string, // Using slabType as style
      customColor: selectedColor === 'custom' ? customColor : undefined,
    };
    onAddDoor(door);
    (e.target as HTMLFormElement).reset();
    setNotes('');
    setOpeningPhoto(null);
  };

  return (
    <Card className="mb-6 bg-charcoal text-charcoal-foreground">
      <CardHeader>
        <CardTitle>Door Configurator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color" className="text-charcoal-foreground">Door Color:</Label>
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
            <Label htmlFor="panelType" className="text-charcoal-foreground">Panel Type:</Label>
            <Select name="panelType" defaultValue="single">
              <SelectTrigger className="bg-[#403E43]">
                <SelectValue placeholder="Select panel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Panel</SelectItem>
                <SelectItem value="double">2 Panel French</SelectItem>
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

          <div className="space-y-2">
            <Label htmlFor="handing" className="text-charcoal-foreground">Handing:</Label>
            <Select name="handing" defaultValue="lh-in">
              <SelectTrigger className="bg-[#403E43]">
                <SelectValue placeholder="Select handing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lh-in">Left Hand In-Swing</SelectItem>
                <SelectItem value="rh-in">Right Hand In-Swing</SelectItem>
                <SelectItem value="lh-out">Left Hand Out-Swing</SelectItem>
                <SelectItem value="rh-out">Right Hand Out-Swing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slabType" className="text-charcoal-foreground">Slab Type:</Label>
            <Select name="slabType" defaultValue="flush">
              <SelectTrigger className="bg-[#403E43]">
                <SelectValue placeholder="Select slab type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flush">Flush</SelectItem>
                <SelectItem value="panel">Panel</SelectItem>
                <SelectItem value="glass">Glass</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hardwareType" className="text-charcoal-foreground">Hardware Type:</Label>
            <Select name="hardwareType" defaultValue="standard">
              <SelectTrigger className="bg-[#403E43]">
                <SelectValue placeholder="Select hardware type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="multipoint">Multi-Point</SelectItem>
                <SelectItem value="panic">Panic</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <Button type="submit" className="w-full">Add Door to List</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoorConfigurator;
