import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";

interface QuoteWithItems {
  id: string;
  quote_number: number;
  createdAt: string;
  itemCount: number;
}

const Dashboard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteWithItems[]>([]);

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    fetchQuotes();
  }, [session, navigate]);

  const fetchQuotes = async () => {
    try {
      // Fetch quotes
      const { data: quotesData, error: quotesError } = await supabase
        .from("Quote")
        .select("id, quote_number, createdAt")
        .order("createdAt", { ascending: false })
        .limit(10);

      if (quotesError) throw quotesError;

      // For each quote, fetch the count of items
      const quotesWithItems = await Promise.all(
        quotesData.map(async (quote) => {
          const { count } = await supabase
            .from("OrderItem")
            .select("*", { count: "exact" })
            .eq("quoteId", quote.id);

          return {
            ...quote,
            itemCount: count || 0,
          };
        })
      );

      setQuotes(quotesWithItems);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch quotes",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (quoteId: string) => {
    try {
      // Delete all order items first
      const { error: itemsError } = await supabase
        .from("OrderItem")
        .delete()
        .eq("quoteId", quoteId);

      if (itemsError) throw itemsError;

      // Then delete the quote
      const { error: quoteError } = await supabase
        .from("Quote")
        .delete()
        .eq("id", quoteId);

      if (quoteError) throw quoteError;

      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });

      // Refresh the quotes list
      fetchQuotes();
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      });
    }
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
            <Button variant="outline" asChild>
              <Link to="/app">New Quote</Link>
            </Button>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Date Saved</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>{quote.quote_number}</TableCell>
                  <TableCell>
                    {format(new Date(quote.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{quote.itemCount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/app?quote=${quote.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(quote.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;