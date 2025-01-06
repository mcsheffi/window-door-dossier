import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WindowConfig } from "./WindowConfigurator";
import { DoorConfig } from "./DoorConfigurator";
import { Copy, Trash2, MoveUp, MoveDown } from "lucide-react";

type Item = WindowConfig | DoorConfig;

interface ItemListProps {
  items: Item[];
  onDeleteItem: (index: number) => void;
  onDuplicateItem: (index: number) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
}

const ItemList = ({ items, onDeleteItem, onDuplicateItem, onMoveItem }: ItemListProps) => {
  const getWindowImage = (style: string, subOption?: string) => {
    // Using placeholder images based on style and sub-option
    if (style === 'casement' && subOption) {
      switch (subOption) {
        case 'left':
          return "/placeholder.svg"; // Replace with casement-left.jpg
        case 'right':
          return "/placeholder.svg"; // Replace with casement-right.jpg
        case 'stationary':
          return "/placeholder.svg"; // Replace with casement-stationary.jpg
        default:
          return "/placeholder.svg";
      }
    }

    if (style === 'horizontal-roller' && subOption) {
      switch (subOption) {
        case 'left-active':
          return "/placeholder.svg"; // Replace with roller-left.jpg
        case 'right-active':
          return "/placeholder.svg"; // Replace with roller-right.jpg
        case 'three-panel':
          return "/placeholder.svg"; // Replace with roller-three.jpg
        default:
          return "/placeholder.svg";
      }
    }

    // Base window styles
    switch (style) {
      case 'single-hung':
        return "/placeholder.svg"; // Replace with single-hung.jpg
      case 'awning':
        return "/placeholder.svg"; // Replace with awning.jpg
      case 'casement':
        return "/placeholder.svg"; // Replace with casement.jpg
      case 'double-hung':
        return "/placeholder.svg"; // Replace with double-hung.jpg
      case 'fixed':
        return "/placeholder.svg"; // Replace with fixed.jpg
      case 'horizontal-roller':
        return "/placeholder.svg"; // Replace with roller.jpg
      default:
        return "/placeholder.svg";
    }
  };

  const renderItemDetails = (item: Item) => {
    if (item.type === 'window') {
      return (
        <div className="flex items-start gap-4">
          <img 
            src={getWindowImage(item.style, item.subOption)} 
            alt={`${item.style} window ${item.subOption ? `(${item.subOption})` : ''}`}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="grid grid-cols-5 gap-4 flex-1">
            <div>Color: {item.color}</div>
            <div>Material: {item.material}</div>
            <div>Width: {item.width}"</div>
            <div>Height: {item.height}"</div>
            <div>Style: {item.style}{item.subOption ? ` (${item.subOption})` : ''}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-4 gap-4">
          <div>Width: {item.width}"</div>
          <div>Height: {item.height}"</div>
          <div>Handing: {item.handing}</div>
          <div>Panel: {item.panelType}</div>
          <div>Slab: {item.slabType}</div>
          <div>Hardware: {item.hardwareType}</div>
          <div>Measurement: {item.measurementGiven}</div>
        </div>
      );
    }
  };

  return (
    <Card className="bg-charcoal text-charcoal-foreground">
      <CardHeader>
        <CardTitle>Item List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border border-charcoal-foreground/20 rounded-lg bg-charcoal/50">
              <div className="flex-1">
                <div className="font-semibold mb-2">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                {renderItemDetails(item)}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onMoveItem(index, index - 1)}
                  disabled={index === 0}
                  className="text-charcoal-foreground"
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onMoveItem(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="text-charcoal-foreground"
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDuplicateItem(index)}
                  className="text-charcoal-foreground"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDeleteItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-charcoal-foreground/60 py-8">
              No items added yet. Use the configurators above to add windows or doors.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemList;