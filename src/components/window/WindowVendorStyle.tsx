import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WindowVendorStyleProps {
  selectedVendor: string;
  onVendorChange: (value: string) => void;
}

const WindowVendorStyle = ({ selectedVendor, onVendorChange }: WindowVendorStyleProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="vendorStyle" className="text-charcoal-foreground">Window Vendor Style:</Label>
      <Select name="vendorStyle" value={selectedVendor} onValueChange={onVendorChange}>
        <SelectTrigger className="bg-[#403E43]">
          <SelectValue placeholder="Select vendor style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cws">CWS</SelectItem>
          <SelectItem value="es-vinyl">ES Vinyl</SelectItem>
          <SelectItem value="es-elite">ES Elite</SelectItem>
          <SelectItem value="es-prestige">ES Prestige</SelectItem>
          <SelectItem value="es-storefront">ES Storefront</SelectItem>
          <SelectItem value="pgt-vinyl">PGT Vinyl</SelectItem>
          <SelectItem value="pgt-aluminum">PGT Aluminum</SelectItem>
          <SelectItem value="cws-aluminum-flange">CWS Aluminum Flange</SelectItem>
          <SelectItem value="cws-aluminum-fin">CWS Aluminum Fin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WindowVendorStyle;