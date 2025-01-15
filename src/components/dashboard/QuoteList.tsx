import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import QuoteCard from "./QuoteCard";

interface Quote {
  id: string;
  quote_number: number;
  createdAt: string;
  builderName: string;
  jobName: string;
  OrderItem: {
    type: string;
  }[];
}

interface QuoteListProps {
  quotes: Quote[];
  loading: boolean;
  onEditQuote: (quoteId: string) => void;
  onDeleteQuote: (quoteId: string) => void;
}

const QuoteList = ({ quotes, loading, onEditQuote, onDeleteQuote }: QuoteListProps) => {
  if (loading) {
    return <p className="text-white">Loading quotes...</p>;
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">No quotes found</p>
        <Button asChild>
          <Link to="/quote">Create Your First Quote</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          onEdit={onEditQuote}
          onDelete={onDeleteQuote}
        />
      ))}
    </div>
  );
};

export default QuoteList;