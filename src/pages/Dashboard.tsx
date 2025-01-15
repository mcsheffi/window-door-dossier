import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

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
      // First, delete all OrderItems associated with this quote
      const { error: orderItemsError } = await supabase
        .from("OrderItem")
        .delete()
        .eq('quoteId', quoteId);

      if (orderItemsError) throw orderItemsError;

      // Then, delete the quote itself
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

  const countItemsByType = (items: { type: string }[]) => {
    const counts = {
      windows: 0,
      doors: 0,
    };

    items.forEach(item => {
      if (item.type === 'window') counts.windows++;
      if (item.type === 'door') counts.doors++;
    });

    return counts;
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/lovable-uploads/ebeb244c-2956-4120-8334-dc0a4488607b.png"
            alt="Bradley Building Products Logo"
            className="h-24 mb-6"
          />
          <div className="w-full flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Recent Quotes</h1>
            <div className="space-x-4">
              <Button variant="outline" asChild>
                <Link to="/quote">Create New Quote</Link>
              </Button>
              <Button variant="outline" onClick={() => supabase.auth.signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
          {loading ? (
            <p className="text-white">Loading quotes...</p>
          ) : quotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No quotes found</p>
              <Button asChild>
                <Link to="/quote">Create Your First Quote</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => {
                const { windows, doors } = countItemsByType(quote.OrderItem);
                return (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg hover:bg-gray-700/40 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="text-white font-medium">
                          {quote.builderName}
                        </p>
                        <span className="text-gray-400">-</span>
                        <p className="text-white">
                          {quote.jobName}
                        </p>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Quote #{quote.quote_number} - {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {windows} Windows, {doors} Doors
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuote(quote.id)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteQuote(quote.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;