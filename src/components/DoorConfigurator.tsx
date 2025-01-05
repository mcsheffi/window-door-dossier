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
            <Select name="productNumber" defaultValue="TTS1003006FLCO">
              <SelectTrigger>
                <SelectValue placeholder="Select product number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TTS1003006FLCO">TTS1003006FLCO</SelectItem>
                <SelectItem value="TTS2003006FLCO">TTS2003006FLCO</SelectItem>
                <SelectItem value="TTS3003006FLCO">TTS3003006FLCO</SelectItem>
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