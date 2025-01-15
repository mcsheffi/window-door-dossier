import { WindowConfig } from "../WindowConfigurator";
import { DoorConfig } from "../DoorConfigurator";
import QuoteInfo from "../QuoteInfo";
import WindowConfigurator from "../WindowConfigurator";
import DoorConfigurator from "../DoorConfigurator";
import ItemList from "../ItemList";
import QuoteActions from "../QuoteActions";

type Item = WindowConfig | DoorConfig;

interface QuoteContainerProps {
  builderName: string;
  jobName: string;
  quoteNumber?: number;
  items: Item[];
  onBuilderNameChange: (value: string) => void;
  onJobNameChange: (value: string) => void;
  onAddWindow: (window: WindowConfig) => void;
  onAddDoor: (door: DoorConfig) => void;
  onDeleteItem: (index: number) => void;
  onDuplicateItem: (index: number) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  onQuoteSaved: (quoteNumber: number) => void;
  session: any;
  quoteId?: string;
}

const QuoteContainer = ({
  builderName,
  jobName,
  quoteNumber,
  items,
  onBuilderNameChange,
  onJobNameChange,
  onAddWindow,
  onAddDoor,
  onDeleteItem,
  onDuplicateItem,
  onMoveItem,
  onQuoteSaved,
  session,
  quoteId,
}: QuoteContainerProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
        <QuoteInfo
          builderName={builderName}
          jobName={jobName}
          quoteNumber={quoteNumber}
          onBuilderNameChange={onBuilderNameChange}
          onJobNameChange={onJobNameChange}
        />
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
        <WindowConfigurator onAddWindow={onAddWindow} />
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
        <DoorConfigurator onAddDoor={onAddDoor} />
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50 hover:shadow-xl transition-shadow">
        <ItemList
          items={items}
          onDeleteItem={onDeleteItem}
          onDuplicateItem={onDuplicateItem}
          onMoveItem={onMoveItem}
        />
      </div>

      <QuoteActions
        builderName={builderName}
        jobName={jobName}
        items={items}
        session={session}
        onQuoteSaved={onQuoteSaved}
        quoteId={quoteId}
      />
    </div>
  );
};

export default QuoteContainer;