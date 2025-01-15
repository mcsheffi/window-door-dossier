import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WindowPhotoAndNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WindowPhotoAndNotes = ({
  notes,
  onNotesChange,
  onPhotoChange
}: WindowPhotoAndNotesProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="openingPhoto" className="text-charcoal-foreground">Opening Photo:</Label>
        <Input 
          type="file" 
          id="openingPhoto" 
          accept="image/*;capture=camera"
          onChange={onPhotoChange}
          className="bg-[#403E43] text-charcoal-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-charcoal-foreground">Notes:</Label>
        <Input 
          type="text" 
          id="notes" 
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any additional notes here" 
          className="bg-[#403E43] text-charcoal-foreground" 
        />
      </div>
    </>
  );
};

export default WindowPhotoAndNotes;