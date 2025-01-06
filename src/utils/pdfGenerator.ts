import jsPDF from 'jspdf';
import { Item } from './pdf/types';
import { getDoorHandingImage, getWindowImage } from './pdf/imageHelpers';
import { getHandingDisplayName, capitalizeFirstLetter, formatDate } from './pdf/textFormatters';
import { supabase } from '@/integrations/supabase/client';

export const generateOrderPDF = async (builderName: string, jobName: string, items: Item[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPos = margin;

  // Get user email
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email || 'N/A';

  // Add logo
  try {
    doc.addImage('/hpp-logo.jpg', 'JPEG', margin, yPos, 50, 20);
  } catch (error) {
    console.error('Error loading logo:', error);
  }

  // Add user email and date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Email: ${userEmail}`, pageWidth - margin - 80, yPos + 10);
  doc.text(`Date: ${formatDate(new Date())}`, pageWidth - margin - 80, yPos + 15);

  yPos += 30;

  // Set dark background color for header
  doc.setFillColor(64, 62, 67); // #403E43
  doc.rect(0, yPos - 10, pageWidth, 40, 'F');
  
  // Add title in white
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Order Details', margin, yPos + 15);

  // Reset text color for content
  doc.setTextColor(0, 0, 0);
  yPos += 50;

  // Add builder and job info in a rounded box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin - 5, yPos - 5, pageWidth - (2 * margin) + 10, 40, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.text(`Builder Name: ${builderName}`, margin, yPos + 5);
  doc.text(`Job Name: ${jobName}`, margin, yPos + 15);
  doc.text(`Quote Date: ${formatDate(new Date())}`, margin, yPos + 25);
  yPos += 45;

  // Add items with numbering
  for (const [index, item] of items.entries()) {
    if (yPos > doc.internal.pageSize.height - 40) {
      doc.addPage();
      yPos = margin;
    }

    // Calculate text width for details
    const maxWidth = pageWidth - (2 * margin) - 35;

    // Add item background with rounded corners
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin - 5, yPos - 5, pageWidth - (2 * margin) + 10, 60, 3, 3, 'F');

    // Add item number
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${index + 1}. ${capitalizeFirstLetter(item.type)}`, margin, yPos + 5);
    
    try {
      let imagePath = item.type === 'door' && item.door
        ? getDoorHandingImage(item.door.handing)
        : getWindowImage(item.style || '', item.subOption);

      const cleanPath = imagePath.replace(/^\//, '');
      
      const img = new Image();
      img.src = cleanPath;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });
      
      doc.addImage(img, 'PNG', margin, yPos + 10, 24, 24);
      
      // Add item details with word wrap
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      let details = '';
      
      if (item.type === 'door' && item.door) {
        details = `${item.door.panelType} ${item.width}×${item.height}″ ${getHandingDisplayName(item.door.handing)} ${item.door.slabType} ${item.door.hardwareType}${item.measurementGiven ? ` - Measurement Given: ${item.measurementGiven.toUpperCase()}` : ''}`;
      } else {
        // Format window details in a single sentence with proper capitalization
        const style = capitalizeFirstLetter(item.style || '');
        const color = item.color ? capitalizeFirstLetter(item.color) : '';
        const material = item.material ? capitalizeFirstLetter(item.material) : '';
        
        details = `${style}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}×${item.height}″${color ? `, ${color}` : ''}${material ? `, ${material}` : ''}${item.measurementGiven ? ` - Measurement Given: ${item.measurementGiven.toUpperCase()}` : ''}`;
      }

      // Split text into lines that fit within maxWidth
      const splitText = doc.splitTextToSize(details, maxWidth);
      doc.text(splitText, margin + 30, yPos + 25);

      // Adjust yPos based on the number of lines in splitText
      const textHeight = splitText.length * 7; // Approximate height per line
      
      // Add notes if present
      if (item.notes) {
        const noteText = `Note: ${item.notes}`;
        const splitNotes = doc.splitTextToSize(noteText, maxWidth);
        doc.text(splitNotes, margin, yPos + 25 + textHeight);
        yPos += (splitNotes.length * 7); // Adjust for note height
      }

      yPos += Math.max(70, textHeight + 30); // Ensure minimum spacing between items

    } catch (error) {
      console.error('Error loading image:', error);
      const details = item.type === 'door' && item.door
        ? `${item.door.panelType} ${item.width}×${item.height}″ ${getHandingDisplayName(item.door.handing)} ${item.door.slabType} ${item.door.hardwareType}`
        : `${capitalizeFirstLetter(item.style || '')}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}×${item.height}″ ${capitalizeFirstLetter(item.color || '')} ${capitalizeFirstLetter(item.material || '')}`;
      
      const splitText = doc.splitTextToSize(details, maxWidth);
      doc.text(splitText, margin + 30, yPos + 25);
      yPos += 70;
    }
  }

  return doc;
};