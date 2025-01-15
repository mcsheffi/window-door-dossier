import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WindowMaterialSelectorProps {
  selectedMaterial: string;
  onMaterialChange: (material: string) => void;
}

const WindowMaterialSelector = ({
  selectedMaterial,
  onMaterialChange
}: WindowMaterialSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="material" className="text-charcoal-foreground">Material:</Label>
      <Select 
        name="material" 
        value={selectedMaterial}
        onValueChange={onMaterialChange}
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
  );
};

export default WindowMaterialSelector;