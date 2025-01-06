import jsPDF from 'jspdf';

interface Item {
  door?: {
    panelType: string;
    width: number;
    height: number;
    handing: string;
    slabType: string;
    hardwareType: string;
  };
  style?: string;
  subOption?: string;
  width: number;
  height: number;
  color?: string;
  material?: string;
  notes?: string;
}

export const generateOrderPDF = (builderName: string, jobName: string, items: Item[]) => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = margin;

  // Add title
  doc.setFontSize(20);
  doc.text('Order Details', margin, yPos);
  yPos += 15;

  // Add builder and job info
  doc.setFontSize(12);
  doc.text(`Builder Name: ${builderName}`, margin, yPos);
  yPos += 10;
  doc.text(`Job Name: ${jobName}`, margin, yPos);
  yPos += 15;

  // Add items
  items.forEach((item) => {
    if (yPos > 270) { // Check if we need a new page
      doc.addPage();
      yPos = margin;
    }

    let details = '';
    if ('door' in item) {
      details = `Door: ${item.door.panelType} ${item.width}″×${item.height}″ - ${item.door.handing} ${item.door.slabType} ${item.door.hardwareType}`;
    } else {
      details = `Window: ${item.style}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material}`;
    }

    // Split long text into multiple lines
    const splitText = doc.splitTextToSize(details, 170);
    doc.text(splitText, margin, yPos);
    yPos += (splitText.length * 7);

    if (item.notes) {
      const noteText = `Note: ${item.notes}`;
      const splitNotes = doc.splitTextToSize(noteText, 170);
      doc.text(splitNotes, margin, yPos);
      yPos += (splitNotes.length * 7);
    }

    yPos += 5; // Add space between items
  });

  return doc;
};