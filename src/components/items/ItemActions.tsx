import { Button } from "@/components/ui/button";
import { Copy, Trash2, MoveUp, MoveDown } from "lucide-react";

interface ItemActionsProps {
  index: number;
  totalItems: number;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onDuplicateItem: (index: number) => void;
  onDeleteItem: (index: number) => void;
}

const ItemActions = ({ 
  index, 
  totalItems, 
  onMoveItem, 
  onDuplicateItem, 
  onDeleteItem 
}: ItemActionsProps) => {
  return (
    <div className="flex flex-col gap-2 justify-center">
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
        disabled={index === totalItems - 1}
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
  );
};

export default ItemActions;