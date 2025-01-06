import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WindowConfig } from "./WindowConfigurator";
import { DoorConfig } from "./DoorConfigurator";
import WindowItem from "./items/WindowItem";
import DoorItem from "./items/DoorItem";
import ItemActions from "./items/ItemActions";

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

  const getDoorHandingImage = (handing: string) => {
    switch (handing) {
      case 'lh-in':
        return "/1p_LH_Inswing.jpg";
      case 'lh-out':
        return "/1p_LH_Outswing.jpg";
      case 'rh-in':
        return "/1p_RH_Inswing.jpg";
      case 'rh-out':
        return "/1p_RH_Outswing.jpg";
      default:
        return "/1p_LH_Inswing.jpg";
    }
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

  return (
    <Card className="bg-charcoal text-charcoal-foreground w-full">
      <CardHeader>
        <CardTitle>Item List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border border-charcoal-foreground/20 rounded-lg bg-charcoal/50">
              <div className="flex-1">
                <div className="font-semibold mb-2">{capitalizeFirstLetter(item.type)}</div>
                {item.type === 'window' ? (
                  <WindowItem item={item} getWindowImage={getWindowImage} />
                ) : (
                  <DoorItem item={item} getDoorHandingImage={getDoorHandingImage} />
                )}
              </div>
              <ItemActions
                index={index}
                totalItems={items.length}
                onMoveItem={onMoveItem}
                onDuplicateItem={onDuplicateItem}
                onDeleteItem={onDeleteItem}
              />
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