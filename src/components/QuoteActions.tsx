import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { saveQuote } from "@/services/quoteService";
import { generateOrderPDF } from "@/utils/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface QuoteActionsProps {
  builderName: string;
  jobName: string;
  items: any[];
  session: any;
  onQuoteSaved: (quoteNumber: number) => void;
  quoteId?: string;
}

const QuoteActions = ({ 
  builderName, 
  jobName, 
  items, 
  session, 
  onQuoteSaved,
  quoteId 
}: QuoteActionsProps) => {
  const { toast } = useToast();

  const validateQuoteData = () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      });
      return false;
    }

    if (!builderName || !jobName) {
      toast({
        title: "Missing Information",
        description: "Please fill in both Builder Name and Job Name.",
        variant: "destructive",
      });
      return false;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Quote",
        description: "Please add at least one window or door to your quote.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveQuote = async () => {
    if (!validateQuoteData()) return;

    try {
      let quote;
      
      if (quoteId) {
        // Update existing quote
        const { data: updatedQuote, error: updateError } = await supabase
          .from("Quote")
          .update({
            builderName,
            jobName,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', quoteId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Delete existing items
        const { error: deleteError } = await supabase
          .from("OrderItem")
          .delete()
          .eq('quoteId', quoteId);

        if (deleteError) throw deleteError;

        // Insert new items with generated IDs
        const { error: itemsError } = await supabase
          .from("OrderItem")
          .insert(items.map(item => ({
            id: uuidv4(),
            quoteId,
            type: item.type,
            width: parseFloat(item.width),
            height: parseFloat(item.height),
            style: item.style || item.panelType,
            subStyle: item.subStyle || item.handing,
            material: item.material,
            color: item.color,
            customColor: item.customColor,
            updatedAt: new Date().toISOString(),
          })));

        if (itemsError) throw itemsError;
        quote = updatedQuote;
      } else {
        // Create new quote
        quote = await saveQuote({
          builderName,
          jobName,
          items,
          userId: session.user.id,
        });
      }

      toast({
        title: quoteId ? "Quote Updated" : "Quote Saved",
        description: `Quote #${quote.quote_number} has been ${quoteId ? 'updated' : 'saved'} successfully.`,
      });

      onQuoteSaved(quote.quote_number);
      return quote;
    } catch (error) {
      console.error("Error saving quote:", error);
      toast({
        title: "Error",
        description: `Failed to ${quoteId ? 'update' : 'save'} quote. Please try again.`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateQuoteData()) return;

    try {
      // First save/update the quote
      const savedQuote = await handleSaveQuote();
      if (!savedQuote) return;

      // Generate and download PDF
      const pdf = await generateOrderPDF(builderName, jobName, items, savedQuote.quote_number);
      pdf.save(`${jobName.replace(/\s+/g, '_')}_order.pdf`);

      toast({
        title: "Order Generated",
        description: "Your order PDF has been downloaded to your device.",
      });
    } catch (error) {
      console.error("Error generating order:", error);
      toast({
        title: "Error",
        description: "Failed to generate order PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button onClick={handleSaveQuote} variant="outline" className="flex-1">
        {quoteId ? 'Update Quote' : 'Save Quote'}
      </Button>
      <Button onClick={handleSubmitOrder} className="flex-1">
        Submit Order
      </Button>
    </div>
  );
};

export default QuoteActions;