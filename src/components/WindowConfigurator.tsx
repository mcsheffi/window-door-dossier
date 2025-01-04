import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WindowConfiguratorProps {
  onAddWindow: (window: WindowConfig) => void;
}

export interface WindowConfig {
  type: 'window';
  color: string;
  material: string;
  width: string;
  height: string;
  style: string;
}

const WindowConfigurator = ({ onAddWindow }: WindowConfiguratorProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const window: WindowConfig = {
      type: 'window',
      color: formData.get('color') as string,
      material: formData.get('material') as string,
      width: formData.get('width') as string,
      height: formData.get('height') as string,
      style: formData.get('style') as string,
    };
    onAddWindow(window);
    (e.target as HTMLFormElement).reset();
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
            <Select name="color" defaultValue="bronze">
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="black">Black</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            <Select name="style" defaultValue="single-hung">
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-hung">Single-Hung</SelectItem>
                <SelectItem value="double-hung">Double-Hung</SelectItem>
                <SelectItem value="sliding">Sliding</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">Add Window to List</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WindowConfigurator;