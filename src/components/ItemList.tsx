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
  const renderItemDetails = (item: Item) => {
    if (item.type === 'window') {
      return (
        <div className="grid grid-cols-5 gap-4">
          <div>Color: {item.color}</div>
          <div>Material: {item.material}</div>
          <div>Width: {item.width}"</div>
          <div>Height: {item.height}"</div>
          <div>Style: {item.style}</div>
        </div>
      );
    } else {
      return (
        <div>Product #: {item.productNumber}</div>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
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
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onMoveItem(index, index + 1)}
                  disabled={index === items.length - 1}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDuplicateItem(index)}
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
            <div className="text-center text-gray-500 py-8">
              No items added yet. Use the configurators above to add windows or doors.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemList;