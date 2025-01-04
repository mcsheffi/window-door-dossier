import { useState } from "react";
import QuoteInfo from "@/components/QuoteInfo";
import WindowConfigurator, { WindowConfig } from "@/components/WindowConfigurator";
import DoorConfigurator, { DoorConfig } from "@/components/DoorConfigurator";
import ItemList from "@/components/ItemList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Item = WindowConfig | DoorConfig;

const Index = () => {
  const [builderName, setBuilderName] = useState("");
  const [jobName, setJobName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const { toast } = useToast();

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

  const handleSubmitOrder = () => {
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
    toast({
      title: "Order Submitted",
      description: "Your order has been submitted successfully!",
    });
    // Here you would typically send the order to a backend
    console.log("Order submitted:", { builderName, jobName, items });
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Window & Door Configurator</h1>
      
      <QuoteInfo
        builderName={builderName}
        jobName={jobName}
        onBuilderNameChange={setBuilderName}
        onJobNameChange={setJobName}
      />
      
      <WindowConfigurator onAddWindow={handleAddWindow} />
      <DoorConfigurator onAddDoor={handleAddDoor} />
      
      <ItemList
        items={items}
        onDeleteItem={handleDeleteItem}
        onDuplicateItem={handleDuplicateItem}
        onMoveItem={handleMoveItem}
      />
      
      <div className="mt-6">
        <Button onClick={handleSubmitOrder} className="w-full">
          Submit Order
        </Button>
      </div>
    </div>
  );
};

export default Index;