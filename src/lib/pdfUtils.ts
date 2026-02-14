export interface PDFOptions {
  filename?: string;
  margin?: number | [number, number] | [number, number, number, number];
  image?: { type: 'jpeg' | 'png' | 'webp'; quality: number };
  html2canvas?: { scale: number; useCORS?: boolean; logging?: boolean; backgroundColor?: string; windowWidth?: number };
  jsPDF?: { unit: string; format: string; orientation: 'portrait' | 'landscape' };
}

export const downloadElementAsPDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  if (!element) {
    throw new Error('Element is required for PDF generation');
  }

  const defaultOptions = {
    filename: 'invoice.pdf',
    margin: [10, 10, 10, 10] as [number, number, number, number],
    image: { type: 'jpeg' as const, quality: 0.95 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    await html2pdf()
      .set(finalOptions)
      .from(element)
      .save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const downloadInvoiceAsPDF = async (
  invoiceElement: HTMLElement,
  invoiceNumber?: string
): Promise<void> => {
  const filename = invoiceNumber 
    ? `invoice-${invoiceNumber}.pdf` 
    : `invoice-${new Date().toISOString().split('T')[0]}.pdf`;

  const options: PDFOptions = {
    filename,
    margin: [10, 10, 10, 10] as [number, number, number, number],
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  return downloadElementAsPDF(invoiceElement, options);
};