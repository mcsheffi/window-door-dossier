import { DoorConfig } from "../DoorConfigurator";

interface DoorItemProps {
  item: DoorConfig;
  getDoorHandingImage: (handing: string) => string;
}

const DoorItem = ({ item, getDoorHandingImage }: DoorItemProps) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const details = `${capitalizeFirstLetter(item.panelType)} ${item.width}″×${item.height}″ ${item.handing} ${item.slabType} ${item.hardwareType} ${item.measurementGiven}${item.notes ? ` - Note: ${item.notes}` : ''}`;
  
  return (
    <div className="flex items-start gap-4">
      <img 
        src={getDoorHandingImage(item.handing)} 
        alt={`${item.handing} door`}
        className="w-24 h-24 object-contain rounded-lg bg-white"
      />
      <div className="flex-1">
        <div>{details}</div>
      </div>
    </div>
  );
};

export default DoorItem;