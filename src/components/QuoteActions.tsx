import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';

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

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = margin;

    // Add title
    doc.setFontSize(20);
    doc.text('Order Details', margin, yPos);
    yPos += 15;

    // Add builder and job info
    doc.setFontSize(12);
    doc.text(`Builder Name: ${builderName}`, margin, yPos);
    yPos += 10;
    doc.text(`Job Name: ${jobName}`, margin, yPos);
    yPos += 15;

    // Add items
    items.forEach((item, index) => {
      if (yPos > 270) { // Check if we need a new page
        doc.addPage();
        yPos = margin;
      }

      let details = '';
      if ('door' in item) {
        details = `Door: ${item.panelType} ${item.width}″×${item.height}″ - ${item.handing} ${item.slabType} ${item.hardwareType}`;
      } else {
        details = `Window: ${item.style}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material}`;
      }

      // Split long text into multiple lines
      const splitText = doc.splitTextToSize(details, 170);
      doc.text(splitText, margin, yPos);
      yPos += (splitText.length * 7);

      if (item.notes) {
        const noteText = `Note: ${item.notes}`;
        const splitNotes = doc.splitTextToSize(noteText, 170);
        doc.text(splitNotes, margin, yPos);
        yPos += (splitNotes.length * 7);
      }

      yPos += 5; // Add space between items
    });

    return doc;
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

      // Generate and download PDF
      const pdf = generatePDF();
      pdf.save(`${jobName.replace(/\s+/g, '_')}_order.pdf`);

      toast({
        title: "Order Submitted",
        description: "Your order has been submitted and emailed to you. The PDF has been downloaded to your device.",
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
