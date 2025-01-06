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

    // Add item background with rounded corners
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin - 5, yPos - 5, pageWidth - (2 * margin) + 10, 60, 3, 3, 'F');

    // Add item number
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${index + 1}. ${capitalizeFirstLetter(item.type)}`, margin, yPos + 5);
    
    // Add item image
    try {
      let imagePath = item.type === 'door' && item.door
        ? getDoorHandingImage(item.door.handing)
        : getWindowImage(item.style || '', item.subOption);

      // Remove the leading slash from the path
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
        details = `${item.door.panelType} ${item.width}″×${item.height}″ ${getHandingDisplayName(item.door.handing)} ${item.door.slabType} ${item.door.hardwareType}`;
        if (item.measurementGiven) {
          details += ` - Measurement Given: ${item.measurementGiven.toUpperCase()}`;
        }
      } else {
        details = `${capitalizeFirstLetter(item.style || '')}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material}`;
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
      const details = item.type === 'door' && item.door
        ? `${item.door.panelType} ${item.width}″×${item.height}″ ${getHandingDisplayName(item.door.handing)} ${item.door.slabType} ${item.door.hardwareType}`
        : `${capitalizeFirstLetter(item.style || '')}${item.subOption ? ` (${item.subOption})` : ''} ${item.width}″×${item.height}″ ${item.color} ${item.material}`;
      
      const splitText = doc.splitTextToSize(details, pageWidth - (2 * margin));
      doc.text(splitText, margin, yPos + 20);
    }

    yPos += 70; // Space for next item
  }

  return doc;
};