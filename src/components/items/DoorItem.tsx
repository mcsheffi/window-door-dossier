import { DoorConfig } from "../DoorConfigurator";

interface DoorItemProps {
  item: DoorConfig;
  getDoorHandingImage: (handing: string) => string;
}

const DoorItem = ({ item, getDoorHandingImage }: DoorItemProps) => {
  const getHandingDisplayName = (handing: string) => {
    switch (handing) {
      case 'lh-in':
        return 'Left Hand In-Swing';
      case 'lh-out':
        return 'Left Hand Out-Swing';
      case 'rh-in':
        return 'Right Hand In-Swing';
      case 'rh-out':
        return 'Right Hand Out-Swing';
      default:
        return handing;
    }
  };

  const details = `${item.panelType} ${item.width}″×${item.height}″ ${getHandingDisplayName(item.handing)} ${item.slabType} ${item.hardwareType} ${item.measurementGiven}${item.notes ? ` - Note: ${item.notes}` : ''}`;
  
  return (
    <div className="flex items-start gap-4">
      <img 
        src={getDoorHandingImage(item.handing)} 
        alt={`${getHandingDisplayName(item.handing)} door`}
        className="w-24 h-24 object-contain rounded-lg bg-white"
      />
      <div className="flex-1">
        <div>{details}</div>
      </div>
    </div>
  );
};

export default DoorItem;