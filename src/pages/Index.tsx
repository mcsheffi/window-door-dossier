import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QuoteInfo from "@/components/QuoteInfo";
import WindowConfigurator, { WindowConfig } from "@/components/WindowConfigurator";
import DoorConfigurator, { DoorConfig } from "@/components/DoorConfigurator";
import ItemList from "@/components/ItemList";
import { Button } from "@/components/ui/button";
import QuoteActions from "@/components/QuoteActions";

type Item = WindowConfig | DoorConfig;

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: quoteId } = useParams(); // Get quote ID from URL if it exists
  const [builderName, setBuilderName] = useState("");
  const [jobName, setJobName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [quoteNumber, setQuoteNumber] = useState<number>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  // Load existing quote data if quoteId is provided
  useEffect(() => {
    const loadQuote = async () => {
      if (!quoteId || !session) return;
      
      setLoading(true);
      try {
        // Fetch quote details
        const { data: quote, error: quoteError } = await supabase
          .from("Quote")
          .select("*")
          .eq("id", quoteId)
          .maybeSingle();

        if (quoteError) throw quoteError;
        if (!quote) {
          toast({
            title: "Error",
            description: "Quote not found",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Set quote details
        setBuilderName(quote.builderName);
        setJobName(quote.jobName);
        setQuoteNumber(quote.quote_number);

        // Fetch order items
        const { data: orderItems, error: itemsError } = await supabase
          .from("OrderItem")
          .select("*")
          .eq("quoteId", quoteId);

        if (itemsError) throw itemsError;

        // Transform order items to match the Item type
        const transformedItems = orderItems.map((item): Item => ({
          type: item.type as "window" | "door",
          vendorStyle: item.style || "",
          openingType: item.subStyle || "",
          color: item.color || "",
          customColor: item.customColor,
          material: item.material || "",
          width: item.width?.toString() || "",
          height: item.height?.toString() || "",
          style: item.style || "",
          subOption: item.subStyle || "",
          measurementGiven: "dlo", // Default value as it's not stored
        }));

        setItems(transformedItems);
      } catch (error) {
        console.error("Error loading quote:", error);
        toast({
          title: "Error",
          description: "Failed to load quote details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [quoteId, session, navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleAddWindow = (window: WindowConfig) => {
    setItems([...items, window]);
    toast({
      title: "Window Added",
      description: "The window has been added to your list.",
    });
  };

  const handleAddDoor = (door: DoorConfig) => {
    setItems([...items, door]);
    toast({
      title: "Door Added",
      description: "The door has been added to your list.",
    });
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    toast({
      title: "Item Deleted",
      description: "The item has been removed from your list.",
    });
  };

  const handleDuplicateItem = (index: number) => {
    const itemToDuplicate = items[index];
    setItems([...items, { ...itemToDuplicate }]);
    toast({
      title: "Item Duplicated",
      description: "A copy of the item has been added to your list.",
    });
  };

  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    const newItems = [...items];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);
    setItems(newItems);
  };

  const handleQuoteSaved = (newQuoteNumber: number) => {
    setQuoteNumber(newQuoteNumber);
    // Only clear the form if we're not editing an existing quote
    if (!quoteId) {
      setBuilderName("");
      setJobName("");
      setItems([]);
    }
  };

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-white">Loading quote details...</div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-white">
              {quoteId ? "Edit Quote" : "Window & Door Configurator"}
            </h1>
            <div className="space-x-4">
              <Button variant="outline" asChild>
                <Link to="/">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
            <QuoteInfo
              builderName={builderName}
              jobName={jobName}
              quoteNumber={quoteNumber}
              onBuilderNameChange={setBuilderName}
              onJobNameChange={setJobName}
            />
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
            <WindowConfigurator onAddWindow={handleAddWindow} />
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
            <DoorConfigurator onAddDoor={handleAddDoor} />
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
            <ItemList
              items={items}
              onDeleteItem={handleDeleteItem}
              onDuplicateItem={handleDuplicateItem}
              onMoveItem={handleMoveItem}
            />
          </div>
        </div>
        
        <QuoteActions
          builderName={builderName}
          jobName={jobName}
          items={items}
          session={session}
          onQuoteSaved={handleQuoteSaved}
          quoteId={quoteId}
        />
      </div>
    </div>
  );
};

export default Index;