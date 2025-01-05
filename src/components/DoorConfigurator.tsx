import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DoorConfiguratorProps {
  onAddDoor: (door: DoorConfig) => void;
}

export interface DoorConfig {
  type: 'door';
  productNumber: string;
}

const DoorConfigurator = ({ onAddDoor }: DoorConfiguratorProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const door: DoorConfig = {
      type: 'door',
      productNumber: formData.get('productNumber') as string,
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
            <Label htmlFor="productNumber" className="text-charcoal-foreground">Product #:</Label>
            <Select name="productNumber" defaultValue="TTS1003068FLCO">
              <SelectTrigger className="bg-charcoal/50 text-charcoal-foreground">
                <SelectValue placeholder="Select product number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PP3080N90CI">PP3080N90CI - Plastpro 3080 Nova 90 White Fiberglass Clear Insulated Impact</SelectItem>
                <SelectItem value="PP3068N90CI">PP3068N90CI - Plastpro 3068 Nova 90 White Fiberglass Clear Insulated Impact</SelectItem>
                <SelectItem value="PP1080N90CI">PP1080N90CI - Plastpro 1080 Nova 90 White Fiberglass Clear Insulated Impact</SelectItem>
                <SelectItem value="TTS1003068FLCO">TTS1003068FLCO - ThermaTru S100 - 3068 Flush Smooth Slab w/Full Lite Cut-Out</SelectItem>
                <SelectItem value="TTS1002868FLCO">TTS1002868FLCO - ThermaTru S100 - 2868 Flush Smooth Slab w/Full Lite Cut-Out</SelectItem>
                <SelectItem value="TTS1002668FLCO">TTS1002668FLCO - ThermaTru S100 - 2668 Flush Smooth Slab w/Full Lite Cut-Out</SelectItem>
                <SelectItem value="TTS8313080">TTS8313080 - ThermaTru S831 - 3080 3 Panel Smooth Slab</SelectItem>
                <SelectItem value="TTS81002880FLCO">TTS81002880FLCO - ThermaTru 2880 S8100 Flush Fiberglass Slab Full Lite Cut-Out</SelectItem>
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