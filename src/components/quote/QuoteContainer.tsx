import { useState, useEffect } from "react";
import { WindowConfig } from "../WindowConfigurator";
import { DoorConfig } from "../DoorConfigurator";
import QuoteInfo from "../QuoteInfo";
import WindowConfigurator from "../WindowConfigurator";
import DoorConfigurator from "../DoorConfigurator";
import ItemList from "../ItemList";
import QuoteActions from "../QuoteActions";
import QuoteDocuments from "./QuoteDocuments";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

type Item = WindowConfig | DoorConfig;

interface SavedQuote {
  id: string;
  builderName: string;
  jobName: string;
  quote_number: number;
}

interface QuoteContainerProps {
  builderName: string;
  jobName: string;
  quoteNumber?: number;
  items: Item[];
  onBuilderNameChange: (value: string) => void;
  onJobNameChange: (value: string) => void;
  onAddWindow: (window: WindowConfig) => void;
  onAddDoor: (door: DoorConfig) => void;
  onDeleteItem: (index: number) => void;
  onDuplicateItem: (index: number) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onQuoteSaved: (quoteNumber: number, quoteId: string) => void;
  session: any;
  quoteId?: string;
}

const QuoteContainer = ({
  builderName,
  jobName,
  quoteNumber,
  items,
  onBuilderNameChange,
  onJobNameChange,
  onAddWindow,
  onAddDoor,
  onDeleteItem,
  onDuplicateItem,
  onMoveItem,
  onQuoteSaved,
  session,
  quoteId,
}: QuoteContainerProps) => {
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedQuotes();
  }, []);

  useEffect(() => {
    const createInitialQuote = async () => {
      if (builderName && jobName && !quoteId && session?.user) {
        const newQuoteId = uuidv4();
        const { data: quote, error } = await supabase
          .from('Quote')
          .insert({
            id: newQuoteId,
            builderName,
            jobName,
            user_id: session.user.id,
          })
          .select()
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to create initial quote",
            variant: "destructive",
          });
          return;
        }

        if (quote) {
          onQuoteSaved(quote.quote_number, quote.id);
        }
      }
    };

    createInitialQuote();
  }, [builderName, jobName, quoteId, session?.user, onQuoteSaved, toast]);

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

    const { data: quote, error: quoteError } = await supabase
      .from('Quote')
      .select('*')
      .eq('id', selectedQuote)
      .single();

    if (quoteError) {
      toast({
        title: "Error",
        description: "Failed to load quote details",
        variant: "destructive",
      });
      return;
    }

    onBuilderNameChange(quote.builderName);
    onJobNameChange(quote.jobName);
    onQuoteSaved(quote.quote_number, quote.id);

    const { data: items, error } = await supabase
      .from('OrderItem')
      .select('*')
      .eq('quoteId', selectedQuote);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load quote items",
        variant: "destructive",
      });
      return;
    }

    // Clear existing items
    while (items && items.length > 0) {
      onDeleteItem(0);
    }

    if (items && items.length > 0) {
      items.forEach(item => {
        if (item.type === 'window') {
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
        } else if (item.type === 'door') {
          const doorConfig: DoorConfig = {
            type: 'door',
            color: item.color || 'bronze',
            customColor: item.customColor,
            material: item.material || 'aluminum',
            width: item.width?.toString() || '',
            height: item.height?.toString() || '',
            panelType: item.style || 'single',
            handing: item.subStyle || 'lh-in',
            slabType: item.slab_type || 'flush',
            hardwareType: item.hardware_type || 'standard',
            measurementGiven: item.measurement_given || 'dlo',
            notes: item.notes,
          };
          onAddDoor(doorConfig);
        }
      });

      toast({
        title: "Success",
        description: "Quote items loaded successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
        <div className="space-y-4 mb-8">
          <div className="space-y-2">
            <Label htmlFor="savedQuote" className="text-white">Load Saved Quote:</Label>
            <Select value={selectedQuote} onValueChange={setSelectedQuote}>
              <SelectTrigger className="bg-[#403E43] text-white">
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

        <QuoteInfo
          builderName={builderName}
          jobName={jobName}
          quoteNumber={quoteNumber}
          onBuilderNameChange={onBuilderNameChange}
          onJobNameChange={onJobNameChange}
        />
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
        <WindowConfigurator onAddWindow={onAddWindow} />
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
        <DoorConfigurator onAddDoor={onAddDoor} />
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
        <ItemList
          items={items}
          onDeleteItem={onDeleteItem}
          onDuplicateItem={onDuplicateItem}
          onMoveItem={onMoveItem}
        />
      </div>

      {quoteId && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
          <QuoteDocuments quoteId={quoteId} />
        </div>
      )}

      <QuoteActions
        builderName={builderName}
        jobName={jobName}
        items={items}
        session={session}
        onQuoteSaved={onQuoteSaved}
        quoteId={quoteId}
      />
    </div>
  );
};

export default QuoteContainer;