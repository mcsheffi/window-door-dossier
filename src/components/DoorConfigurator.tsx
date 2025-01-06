import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}

const DoorConfigurator = ({ onAddDoor }: DoorConfiguratorProps) => {
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
    };
    onAddDoor(door);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Card className="mb-6 bg-charcoal text-charcoal-foreground">
      <CardHeader>
        <CardTitle>Door Configurator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" className="w-full">Add Door to List</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoorConfigurator;