import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { saveQuote } from "@/services/quoteService";
import { generateOrderPDF } from "@/utils/pdfGenerator";

interface QuoteActionsProps {
  builderName: string;
  jobName: string;
  items: any[];
  session: any;
  onQuoteSaved: (quoteNumber: number) => void;
}

const QuoteActions = ({ builderName, jobName, items, session, onQuoteSaved }: QuoteActionsProps) => {
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
      const quote = await saveQuote({
        builderName,
        jobName,
        items,
        userId: session.user.id,
      });

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

  const handleSubmitOrder = () => {
    if (!validateQuoteData()) return;

    try {
      // Generate and download PDF
      const pdf = generateOrderPDF(builderName, jobName, items);
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
        Save Quote
      </Button>
      <Button onClick={handleSubmitOrder} className="flex-1">
        Submit Order
      </Button>
    </div>
  );
};

export default QuoteActions;