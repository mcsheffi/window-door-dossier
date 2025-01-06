import jsPDF from 'jspdf';

interface Item {
  type: string;
  door?: {
    panelType: string;
    width: number;
    height: number;
    handing: string;
    slabType: string;
    hardwareType: string;
    measurementGiven?: string;
  };
  style?: string;
  subOption?: string;
  width: number;
  height: number;
  color?: string;
  material?: string;
  notes?: string;
  measurementGiven?: string;
}

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

export const generateOrderPDF = (builderName: string, jobName: string, items: Item[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPos = margin;

  // Set dark background color for header
  doc.setFillColor(64, 62, 67); // #403E43
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Add title in white
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Order Details', margin, 30);

  // Reset text color for content
  doc.setTextColor(0, 0, 0);
  yPos = 60;

  // Add builder and job info
  doc.setFontSize(12);
  doc.text(`Builder Name: ${builderName}`, margin, yPos);
  yPos += 10;
  doc.text(`Job Name: ${jobName}`, margin, yPos);
  yPos += 20;

  // Add items
  items.forEach((item, index) => {
    if (yPos > 250) { // Check if we need a new page
      doc.addPage();
      yPos = margin;
    }

    // Add item background
    doc.setFillColor(245, 245, 245);
    doc.rect(margin - 5, yPos - 5, pageWidth - (2 * margin) + 10, 40, 'F');

    // Add item type header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(item.type.charAt(0).toUpperCase() + item.type.slice(1), margin, yPos + 5);
    
    // Add item details
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    let details = '';
    
    if (item.type === 'door' && item.door) {
      details = `${item.door.panelType} ${item.width}″×${item.height}″ ${getHandingDisplayName(item.door.handing)} ${item.door.slabType} ${item.door.hardwareType}`;
      if (item.measurementGiven) {
        details += ` - Measurement Given: ${item.measurementGiven.toUpperCase()}`;
      }
    } else {
      details = `${item.style}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material}`;
      if (item.measurementGiven) {
        details += ` - Measurement Given: ${item.measurementGiven.toUpperCase()}`;
      }
    }

    // Split long text into multiple lines
    const splitText = doc.splitTextToSize(details, pageWidth - (2 * margin));
    doc.text(splitText, margin, yPos + 20);

    // Add notes if present
    if (item.notes) {
      yPos += (splitText.length * 12);
      const noteText = `Note: ${item.notes}`;
      const splitNotes = doc.splitTextToSize(noteText, pageWidth - (2 * margin));
      doc.text(splitNotes, margin, yPos + 20);
      yPos += (splitNotes.length * 12);
    }

    yPos += 50; // Space for next item
  });

  return doc;
};