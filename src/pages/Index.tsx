import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import QuoteInfo from "@/components/QuoteInfo";
import WindowConfigurator, { WindowConfig } from "@/components/WindowConfigurator";
import DoorConfigurator, { DoorConfig } from "@/components/DoorConfigurator";
import ItemList from "@/components/ItemList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Item = WindowConfig | DoorConfig;

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [builderName, setBuilderName] = useState("");
  const [jobName, setJobName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

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
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userId: session.user.id,
            userEmail: session.user.email,
            builderName,
            jobName,
            items,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send order email");
      }

      toast({
        title: "Order Submitted",
        description: "Your order has been submitted and emailed to you. Please check your email and print to PDF.",
      });

      // Clear the form
      setBuilderName("");
      setJobName("");
      setItems([]);
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return null;
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
            <h1 className="text-3xl font-bold text-white">Window & Door Configurator</h1>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
            <QuoteInfo
              builderName={builderName}
              jobName={jobName}
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
        
        <div className="mt-6">
          <Button onClick={handleSubmitOrder} className="w-full bg-primary hover:bg-primary/90">
            Submit Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;