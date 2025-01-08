import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WindowOpeningTypeProps {
  selectedOpening: string;
  onOpeningChange: (value: string) => void;
}

const WindowOpeningType = ({ selectedOpening, onOpeningChange }: WindowOpeningTypeProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="openingType" className="text-charcoal-foreground">Opening Type:</Label>
      <Select name="openingType" value={selectedOpening} onValueChange={onOpeningChange}>
        <SelectTrigger className="bg-[#403E43]">
          <SelectValue placeholder="Select opening type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="masonry">Masonry Opening</SelectItem>
          <SelectItem value="recessed">Recessed Fin</SelectItem>
          <SelectItem value="wood">Wood Frame Opening</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WindowOpeningType;