import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface QuoteActionsProps {
  builderName: string;
  jobName: string;
  items: any[];
  session: any;
  onQuoteSaved: (quoteNumber: number) => void;
}

const QuoteActions = ({ builderName, jobName, items, session, onQuoteSaved }: QuoteActionsProps) => {
  const { toast } = useToast();

  const handleSaveQuote = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to save a quote.",
        variant: "destructive",
      });
      return;
    }

    if (!builderName || !jobName) {
      toast({
        title: "Missing Information",
        description: "Please fill in both Builder Name and Job Name before saving.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Quote",
        description: "Please add at least one window or door to your quote before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      const quoteId = uuidv4();
      const now = new Date().toISOString();

      const { data: quote, error: quoteError } = await supabase
        .from("Quote")
        .insert({
          id: quoteId,
          builderName,
          jobName,
          user_id: session.user.id,
          updatedAt: now,
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      const itemsWithQuoteId = items.map((item) => ({
        id: uuidv4(),
        quoteId: quote.id,
        type: 'door' in item ? 'door' : 'window',
        width: item.width,
        height: item.height,
        style: 'door' in item ? item.panelType : item.style,
        subStyle: 'door' in item ? item.handing : item.subOption,
        material: item.material || null,
        color: item.color || null,
        productNumber: null,
        updatedAt: now,
      }));

      const { error: itemsError } = await supabase
        .from("OrderItem")
        .insert(itemsWithQuoteId);

      if (itemsError) throw itemsError;

      toast({
        title: "Quote Saved",
        description: `Quote #${quote.quote_number} has been saved successfully.`,
      });

      onQuoteSaved(quote.quote_number);
    } catch (error) {
      console.error("Error saving quote:", error);
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitOrder = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an order.",
        variant: "destructive",
      });
      return;
    }

    if (!builderName || !jobName) {
      toast({
        title: "Missing Information",
        description: "Please fill in both Builder Name and Job Name before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add at least one window or door to your order before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-order-email', {
        body: {
          userId: session.user.id,
          userEmail: session.user.email,
          builderName,
          jobName,
          items,
        },
      });

      if (error) throw error;

      toast({
        title: "Order Submitted",
        description: "Your order has been submitted and emailed to you. Please check your email and print to PDF.",
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button onClick={handleSaveQuote} variant="outline" className="flex-1">
        Save Quote
      </Button>
      <Button onClick={handleSubmitOrder} className="flex-1">
        Submit Order
      </Button>
    </div>
  );
};

export default QuoteActions;