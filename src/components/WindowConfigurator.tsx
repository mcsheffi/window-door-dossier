import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WindowMeasurements from "./window/WindowMeasurements";
import WindowStyleOptions from "./window/WindowStyleOptions";
import WindowVendorStyle from "./window/WindowVendorStyle";
import WindowOpeningType from "./window/WindowOpeningType";
import WindowColorSelector from "./window/WindowColorSelector";
import WindowMaterialSelector from "./window/WindowMaterialSelector";
import WindowPhotoAndNotes from "./window/WindowPhotoAndNotes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface WindowConfiguratorProps {
  onAddWindow: (window: WindowConfig) => void;
  builderName?: string;
  jobName?: string;
}

export interface WindowConfig {
  type: 'window';
  vendorStyle: string;
  openingType: string;
  color: string;
  customColor?: string;
  material: string;
  width: string;
  height: string;
  style: string;
  subOption?: string;
  measurementGiven: string;
  openingPhoto?: File;
  notes?: string;
  numberOfPanels?: string;
  stackType?: string;
  pocketType?: string;
}

interface SavedQuote {
  id: string;
  builderName: string;
  jobName: string;
  quote_number: number;
}

const WindowConfigurator = ({ onAddWindow, builderName, jobName }: WindowConfiguratorProps) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('single-hung');
  const [showSubOption, setShowSubOption] = useState(false);
  const [showDoorOptions, setShowDoorOptions] = useState(false);
  const [openingPhoto, setOpeningPhoto] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('bronze');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('aluminum');
  const [customColor, setCustomColor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [measurementGiven, setMeasurementGiven] = useState<string>('dlo');
  const [selectedVendor, setSelectedVendor] = useState<string>('cws');
  const [selectedOpening, setSelectedOpening] = useState<string>('masonry');
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedQuotes();
  }, []);

  const fetchSavedQuotes = async () => {
    const { data: quotes, error } = await supabase
      .from('Quote')
      .select('id, builderName, jobName, quote_number')
      .order('createdAt', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch saved quotes",
        variant: "destructive",
      });
      return;
    }

    setSavedQuotes(quotes || []);
  };

  const handleLoadQuote = async () => {
    if (!selectedQuote) {
      toast({
        title: "Error",
        description: "Please select a quote to load",
        variant: "destructive",
      });
      return;
    }

    const { data: items, error } = await supabase
      .from('OrderItem')
      .select('*')
      .eq('quoteId', selectedQuote)
      .eq('type', 'window');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load quote items",
        variant: "destructive",
      });
      return;
    }

    if (items && items.length > 0) {
      items.forEach(item => {
        const windowConfig: WindowConfig = {
          type: 'window',
          vendorStyle: item.vendor_style || 'cws',
          openingType: item.opening_type || 'masonry',
          color: item.color || 'bronze',
          customColor: item.customColor,
          material: item.material || 'aluminum',
          width: item.width?.toString() || '',
          height: item.height?.toString() || '',
          style: item.style || 'single-hung',
          subOption: item.subStyle,
          measurementGiven: item.measurement_given || 'dlo',
          notes: item.notes,
          numberOfPanels: item.number_of_panels,
          stackType: item.stack_type,
          pocketType: item.pocket_type,
        };
        onAddWindow(windowConfig);
      });

      toast({
        title: "Success",
        description: "Quote items loaded successfully",
      });
    }
  };

  const handleStyleChange = (value: string) => {
    setSelectedStyle(value);
    setShowSubOption(value === 'casement' || value === 'horizontal-roller');
    setShowDoorOptions(value === 'sliding-glass-door' || value === 'swing-door');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOpeningPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const window: WindowConfig = {
      type: 'window',
      vendorStyle: selectedVendor,
      openingType: selectedOpening,
      color: selectedColor === 'custom' ? customColor : selectedColor,
      material: selectedMaterial,
      width: formData.get('width') as string,
      height: formData.get('height') as string,
      style: formData.get('style') as string,
      subOption: formData.get('subOption') as string,
      measurementGiven: formData.get('measurementGiven') as string,
      openingPhoto: openingPhoto || undefined,
      notes: notes || undefined,
      numberOfPanels: formData.get('numberOfPanels') as string,
      stackType: formData.get('stackType') as string,
      pocketType: formData.get('pocketType') as string,
    };
    onAddWindow(window);
    (e.target as HTMLFormElement).reset();
    setShowSubOption(false);
    setShowDoorOptions(false);
    setSelectedStyle('single-hung');
    setOpeningPhoto(null);
    setNotes('');
  };

  return (
    <Card className="mb-6 bg-charcoal text-charcoal-foreground">
      <CardHeader>
        <CardTitle>Window Configurator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="savedQuote">Load Saved Quote:</Label>
            <Select value={selectedQuote} onValueChange={setSelectedQuote}>
              <SelectTrigger className="bg-[#403E43]">
                <SelectValue placeholder="Select a saved quote" />
              </SelectTrigger>
              <SelectContent>
                {savedQuotes.map((quote) => (
                  <SelectItem key={quote.id} value={quote.id}>
                    {quote.builderName} - {quote.jobName} (#{quote.quote_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleLoadQuote}
            variant="outline"
            className="w-full"
          >
            Load Selected Quote
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <WindowVendorStyle
            selectedVendor={selectedVendor}
            onVendorChange={setSelectedVendor}
          />

          <WindowOpeningType
            selectedOpening={selectedOpening}
            onOpeningChange={setSelectedOpening}
          />

          <WindowColorSelector
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            customColor={customColor}
            onCustomColorChange={setCustomColor}
          />

          <WindowMaterialSelector
            selectedMaterial={selectedMaterial}
            onMaterialChange={setSelectedMaterial}
          />

          <div className="space-y-2">
            <Label htmlFor="style" className="text-charcoal-foreground">Window Style:</Label>
            <Select name="style" value={selectedStyle} onValueChange={handleStyleChange}>
              <SelectTrigger className="bg-[#403E43]">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-hung">Single-Hung</SelectItem>
                <SelectItem value="awning">Awning</SelectItem>
                <SelectItem value="casement">Casement</SelectItem>
                <SelectItem value="double-hung">Double-Hung</SelectItem>
                <SelectItem value="fixed">Fixed Window</SelectItem>
                <SelectItem value="horizontal-roller">Horizontal Roller</SelectItem>
                <SelectItem value="sliding-glass-door">Sliding Glass Door</SelectItem>
                <SelectItem value="swing-door">Swing Door</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <WindowMeasurements
            measurementGiven={measurementGiven}
            onMeasurementChange={setMeasurementGiven}
          />

          <WindowStyleOptions
            selectedStyle={selectedStyle}
            showSubOption={showSubOption}
            showDoorOptions={showDoorOptions}
          />

          <WindowPhotoAndNotes
            notes={notes}
            onNotesChange={setNotes}
            onPhotoChange={handlePhotoChange}
          />

          <Button type="submit" className="w-full">Add Window to List</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WindowConfigurator;
