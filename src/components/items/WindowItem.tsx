import { WindowConfig } from "../WindowConfigurator";

interface WindowItemProps {
  item: WindowConfig;
  getWindowImage: (style: string, subOption?: string) => string;
}

const WindowItem = ({ item, getWindowImage }: WindowItemProps) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const details = `${capitalizeFirstLetter(item.style)}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material} - Measurement Given: ${item.measurementGiven?.toUpperCase()}${item.notes ? ` - Note: ${item.notes}` : ''}`;
  
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
};

export default WindowItem;