import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuoteList from "@/components/dashboard/QuoteList";

interface Quote {
  id: string;
  quote_number: number;
  createdAt: string;
  builderName: string;
  jobName: string;
  OrderItem: {
    type: string;
  }[];
}

const Dashboard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    fetchQuotes();
  }, [session, navigate]);

  const fetchQuotes = async () => {
    try {
      const { data: quotesData, error: quotesError } = await supabase
        .from("Quote")
        .select(`
          id,
          quote_number,
          createdAt,
          builderName,
          jobName,
          OrderItem (
            type
          )
        `)
        .order('createdAt', { ascending: false })
        .limit(10);

      if (quotesError) throw quotesError;
      setQuotes(quotesData || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Error",
        description: "Failed to load quotes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuote = (quoteId: string) => {
    navigate(`/quote/${quoteId}`);
  };

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const { error: orderItemsError } = await supabase
        .from("OrderItem")
        .delete()
        .eq('quoteId', quoteId);

      if (orderItemsError) throw orderItemsError;

      const { error: quoteError } = await supabase
        .from("Quote")
        .delete()
        .eq('id', quoteId);

      if (quoteError) throw quoteError;

      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });

      fetchQuotes();
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: "Error",
        description: "Failed to delete quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container max-w-4xl">
        <DashboardHeader />
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
          <QuoteList
            quotes={quotes}
            loading={loading}
            onEditQuote={handleEditQuote}
            onDeleteQuote={handleDeleteQuote}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;