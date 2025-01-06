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
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getWindowImage = (style: string, subOption?: string) => {
    if (style === 'casement' && subOption) {
      switch (subOption) {
        case 'left':
          return "/lovable-uploads/b874a9fa-457e-4134-90fc-d460d91eb02d.png";
        case 'right':
          return "/lovable-uploads/ec7ae7f2-7ff6-4e62-b330-480f955ac5c5.png";
        case 'stationary':
          return "/lovable-uploads/78a3d360-4d9e-4e82-b1cc-10598861e547.png";
        default:
          return "/lovable-uploads/78a3d360-4d9e-4e82-b1cc-10598861e547.png";
      }
    }

    if (style === 'horizontal-roller' && subOption) {
      switch (subOption) {
        case 'left-active':
          return "/lovable-uploads/a7db2b78-c61d-4142-b7eb-04516c3ba179.png";
        case 'right-active':
          return "/lovable-uploads/a7db2b78-c61d-4142-b7eb-04516c3ba179.png";
        case 'three-panel':
          return "/lovable-uploads/a7db2b78-c61d-4142-b7eb-04516c3ba179.png";
        default:
          return "/lovable-uploads/a7db2b78-c61d-4142-b7eb-04516c3ba179.png";
      }
    }

    switch (style) {
      case 'single-hung':
        return "/lovable-uploads/0ad439c6-c89a-43b1-966f-e77d73f5b7d2.png";
      case 'awning':
        return "/lovable-uploads/34071465-4922-47fe-986a-cf7b8b2346a2.png";
      case 'double-hung':
        return "/lovable-uploads/943d87fa-a111-4221-bdc0-f75e8043c3ee.png";
      case 'fixed':
        return "/lovable-uploads/78a3d360-4d9e-4e82-b1cc-10598861e547.png";
      default:
        return "/lovable-uploads/78a3d360-4d9e-4e82-b1cc-10598861e547.png";
    }
  };

  const renderItemDetails = (item: Item) => {
    if (item.type === 'window') {
      const details = `${capitalizeFirstLetter(item.style)}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material}${item.notes ? ` - Note: ${item.notes}` : ''}`;
      
      return (
        <div className="flex items-start gap-4">
          <img 
            src={getWindowImage(item.style, item.subOption)} 
            alt={`${item.style} window ${item.subOption ? `(${item.subOption})` : ''}`}
            className="w-24 h-24 object-contain rounded-lg bg-white"
          />
          <div className="flex-1">
            <div>{details}</div>
          </div>
        </div>
      );
    } else {
      const details = `${capitalizeFirstLetter(item.panelType)} ${item.width}″×${item.height}″ ${item.handing} ${item.slabType} ${item.hardwareType} ${item.measurementGiven}${item.notes ? ` - Note: ${item.notes}` : ''}`;
      
      return (
        <div className="flex-1">
          <div>{details}</div>
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
                <div className="font-semibold mb-2">{capitalizeFirstLetter(item.type)}</div>
                {renderItemDetails(item)}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onMoveItem(index, index - 1)}
                  disabled={index === 0}
                  className="text-black hover:text-black/80"
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onMoveItem(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="text-black hover:text-black/80"
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDuplicateItem(index)}
                  className="text-black hover:text-black/80"
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