import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DoorConfiguratorProps {
  onAddDoor: (door: DoorConfig) => void;
  builderName?: string;
  jobName?: string;
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
  color?: string;
  customColor?: string;
  material?: string;
}

interface SavedQuote {
  id: string;
  builderName: string;
  jobName: string;
  quote_number: number;
}

const DoorConfigurator = ({ onAddDoor, builderName, jobName }: DoorConfiguratorProps) => {
  const [notes, setNotes] = useState<string>('');
  const [openingPhoto, setOpeningPhoto] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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
      .eq('type', 'door');

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
        const doorConfig: DoorConfig = {
          type: 'door',
          width: item.width?.toString() || '',
          height: item.height?.toString() || '',
          handing: item.subStyle || 'lh-in',
          panelType: item.style || 'single',
          slabType: item.slab_type || 'flush',
          hardwareType: item.hardware_type || 'standard',
          measurementGiven: item.measurement_given || 'dlo',
          notes: item.notes,
        };
        onAddDoor(doorConfig);
      });

      toast({
        title: "Success",
        description: "Quote items loaded successfully",
      });
    }
  };

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
    };
    onAddDoor(door);
    (e.target as HTMLFormElement).reset();
    setNotes('');
    setOpeningPhoto(null);
  };

  return (
    <Card className="mb-6 bg-charcoal text-charcoal-foreground">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Door Configurator</CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle door configurator</span>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DoorConfigurator;
