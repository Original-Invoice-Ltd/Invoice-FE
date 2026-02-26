import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Downloads an invoice as PDF using html-to-image + jsPDF.
 * This approach takes a visual snapshot (like a screenshot) and embeds it in a PDF.
 * It avoids all CSS parsing issues with modern color functions.
 */
export const downloadInvoiceAsPDF = async (
  invoiceElement: HTMLElement,
  invoiceNumber?: string
): Promise<void> => {
  if (!invoiceElement) {
    throw new Error('Invoice element is required for PDF generation');
  }

  try {
    // Generate filename
    const filename = invoiceNumber 
      ? `invoice-${invoiceNumber}.pdf` 
      : `invoice-${new Date().toISOString().split('T')[0]}.pdf`;

    // Get the dimensions of the invoice element
    const width = invoiceElement.offsetWidth;
    const height = invoiceElement.offsetHeight;

    // Convert HTML to PNG image with high quality
    const dataUrl = await toPng(invoiceElement, {
      quality: 1.0,
      pixelRatio: 2, // Higher resolution for better quality
      cacheBust: true,
      backgroundColor: '#ffffff',
    });

    // Calculate PDF dimensions (A4 size in mm)
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = (height * pdfWidth) / width; // Maintain aspect ratio

    // Create PDF with appropriate orientation
    const orientation = pdfHeight > pdfWidth ? 'portrait' : 'landscape';
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    // Add the image to the PDF
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Alternative function name for compatibility
 */
export const printInvoiceAsPDF = downloadInvoiceAsPDF;
