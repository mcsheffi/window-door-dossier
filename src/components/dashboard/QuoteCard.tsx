import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuoteCardProps {
  quote: {
    id: string;
    quote_number: number;
    createdAt: string;
    builderName: string;
    jobName: string;
    OrderItem: {
      type: string;
    }[];
  };
  onEdit: (quoteId: string) => void;
  onDelete: (quoteId: string) => void;
}

const QuoteCard = ({ quote, onEdit, onDelete }: QuoteCardProps) => {
  const navigate = useNavigate();
  const { windows, doors } = countItemsByType(quote.OrderItem);

  const handleEdit = () => {
    navigate(`/${quote.id}`);
  };

  return (
    <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-lg hover:bg-gray-700/40 transition-colors">
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <p className="text-white font-medium">
            {quote.builderName}
          </p>
          <span className="text-gray-400">-</span>
          <p className="text-white">
            {quote.jobName}
          </p>
        </div>
        <p className="text-gray-400 text-sm">
          Quote #{quote.quote_number} - {format(new Date(quote.createdAt), 'MMM d, yyyy')}
        </p>
        <p className="text-gray-400 text-sm">
          {windows} Windows, {doors} Doors
        </p>
      </div>
      <div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(quote.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
};

const countItemsByType = (items: { type: string }[]) => {
  const counts = {
    windows: 0,
    doors: 0,
  };

  items.forEach(item => {
    if (item.type === 'window') counts.windows++;
    if (item.type === 'door') counts.doors++;
  });

  return counts;
};

export default QuoteCard;