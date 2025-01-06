import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Quote {
  id: string;
  builderName: string;
  jobName: string;
  quote_number: number;
  createdAt: string;
}

const Dashboard = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentQuotes();
  }, []);

  const fetchRecentQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("Quote")
        .select("*")
        .order("createdAt", { ascending: false })
        .limit(10);

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Error",
        description: "Failed to load recent quotes",
        variant: "destructive",
      });
    }
  };

  const handleLoadQuote = (quoteId: string) => {
    navigate(`/?quoteId=${quoteId}`);
  };

  const handleCreateNewQuote = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Recent Quotes</h1>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={handleCreateNewQuote}
          >
            Create New Quote
          </Button>
        </div>
        
        <div className="space-y-4">
          {quotes.map((quote) => (
            <Card 
              key={quote.id} 
              className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/70 transition-colors cursor-pointer"
              onClick={() => handleLoadQuote(quote.id)}
            >
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Quote #{quote.quote_number} - {quote.jobName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Builder: {quote.builderName}</p>
                <p className="text-gray-400 text-sm">
                  Created: {new Date(quote.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;