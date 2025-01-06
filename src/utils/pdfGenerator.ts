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

export const generateOrderPDF = async (builderName: string, jobName: string, items: Item[]) => {
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
  for (const item of items) {
    if (yPos > 250) { // Check if we need a new page
      doc.addPage();
      yPos = margin;
    }

    // Add item background
    doc.setFillColor(245, 245, 245);
    doc.rect(margin - 5, yPos - 5, pageWidth - (2 * margin) + 10, 60, 'F');

    // Add item type header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(item.type.charAt(0).toUpperCase() + item.type.slice(1), margin, yPos + 5);
    
    // Add item image
    try {
      let imagePath;
      if (item.type === 'door' && item.door) {
        imagePath = getDoorHandingImage(item.door.handing);
      } else {
        imagePath = getWindowImage(item.style || '', item.subOption);
      }

      // Remove the leading slash from the path
      const cleanPath = imagePath.replace(/^\//, '');
      
      // Load and add the image
      const img = new Image();
      img.src = cleanPath;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Add the image to the PDF
      doc.addImage(img, 'PNG', margin, yPos + 10, 24, 24);
      
      // Add item details with offset for image
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
      const splitText = doc.splitTextToSize(details, pageWidth - (2 * margin) - 30);
      doc.text(splitText, margin + 30, yPos + 25);

      // Add notes if present
      if (item.notes) {
        yPos += (splitText.length * 12);
        const noteText = `Note: ${item.notes}`;
        const splitNotes = doc.splitTextToSize(noteText, pageWidth - (2 * margin));
        doc.text(splitNotes, margin, yPos + 20);
        yPos += (splitNotes.length * 12);
      }

    } catch (error) {
      console.error('Error loading image:', error);
      // Continue without the image if there's an error
      const details = item.type === 'door' && item.door
        ? `${item.door.panelType} ${item.width}″×${item.height}″ ${getHandingDisplayName(item.door.handing)} ${item.door.slabType} ${item.door.hardwareType}`
        : `${item.style}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material}`;
      
      const splitText = doc.splitTextToSize(details, pageWidth - (2 * margin));
      doc.text(splitText, margin, yPos + 20);
    }

    yPos += 70; // Increased space for next item to accommodate image
  }

  return doc;
};