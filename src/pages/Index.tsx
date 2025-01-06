import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Quote")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching quotes",
          description: error.message,
        });
        return [];
      }

      return data;
    },
  });

  const handleEdit = (quoteId: string) => {
    navigate(`/quote?id=${quoteId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quotes</h1>
      <div className="grid gap-4">
        {quotes?.map((quote) => (
          <div
            key={quote.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Quote #{quote.quote_number}</p>
              <p className="text-sm text-gray-600">
                Builder: {quote.builderName}
              </p>
              <p className="text-sm text-gray-600">
                Job: {quote.jobName}
              </p>
            </div>
            <Button onClick={() => handleEdit(quote.id)}>
              Edit Quote
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;