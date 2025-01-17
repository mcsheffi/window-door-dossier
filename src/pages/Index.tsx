import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WindowConfig } from "@/components/WindowConfigurator";
import { DoorConfig } from "@/components/DoorConfigurator";
import PageHeader from "@/components/layout/PageHeader";
import QuoteContainer from "@/components/quote/QuoteContainer";
import LoadingState from "@/components/quote/LoadingState";

type Item = WindowConfig | DoorConfig;

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: initialQuoteId } = useParams();
  const [builderName, setBuilderName] = useState("");
  const [jobName, setJobName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [quoteNumber, setQuoteNumber] = useState<number>();
  const [quoteId, setQuoteId] = useState<string | undefined>(initialQuoteId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  useEffect(() => {
    const loadQuote = async () => {
      if (!quoteId || !session) return;
      
      setLoading(true);
      try {
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

        setBuilderName(quote.builderName);
        setJobName(quote.jobName);
        setQuoteNumber(quote.quote_number);

        const { data: orderItems, error: itemsError } = await supabase
          .from("OrderItem")
          .select("*")
          .eq("quoteId", quoteId);

        if (itemsError) throw itemsError;

        const transformedItems = orderItems.map((item): Item => {
          const baseConfig = {
            width: item.width?.toString() || "",
            height: item.height?.toString() || "",
            color: item.color || "",
            customColor: item.customColor || "",
            material: item.material || "",
            notes: item.notes || undefined,
            openingPhoto: undefined,
          };

          if (item.type === "window") {
            return {
              ...baseConfig,
              type: "window",
              style: item.style || "",
              subOption: item.subStyle || undefined,
              vendorStyle: item.vendor_style || "cws",
              openingType: item.opening_type || "masonry",
              measurementGiven: item.measurement_given || "dlo",
              numberOfPanels: item.number_of_panels?.toString(),
              stackType: item.stack_type,
              pocketType: item.pocket_type,
            } as WindowConfig;
          } else {
            return {
              ...baseConfig,
              type: "door",
              panelType: item.style || "single",
              handing: item.subStyle || "lh-in",
              slabType: item.slab_type || "flush",
              hardwareType: item.hardware_type || "standard",
              measurementGiven: item.measurement_given || "dlo",
            } as DoorConfig;
          }
        });

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

  const handleQuoteSaved = (newQuoteNumber: number, newQuoteId: string) => {
    setQuoteNumber(newQuoteNumber);
    setQuoteId(newQuoteId);
    if (!quoteId) {
      navigate(`/quote/${newQuoteId}`);
    }
  };

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

  if (!session) {
    return null;
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container max-w-4xl">
        <PageHeader isEditing={!!quoteId} onSignOut={handleSignOut} />
        <QuoteContainer
          builderName={builderName}
          jobName={jobName}
          quoteNumber={quoteNumber}
          items={items}
          onBuilderNameChange={setBuilderName}
          onJobNameChange={setJobName}
          onAddWindow={handleAddWindow}
          onAddDoor={handleAddDoor}
          onDeleteItem={handleDeleteItem}
          onDuplicateItem={handleDuplicateItem}
          onMoveItem={handleMoveItem}
          onQuoteSaved={handleQuoteSaved}
          session={session}
          quoteId={quoteId}
        />
      </div>
    </div>
  );
};

export default Index;
