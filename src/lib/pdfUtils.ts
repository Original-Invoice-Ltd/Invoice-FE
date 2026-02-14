export interface PDFOptions {
  filename?: string;
  margin?: number | [number, number] | [number, number, number, number];
  image?: { type: 'jpeg' | 'png' | 'webp'; quality: number };
  html2canvas?: { 
    scale: number; 
    useCORS?: boolean; 
    logging?: boolean; 
    backgroundColor?: string; 
    windowWidth?: number;
    onclone?: (clonedDoc: Document) => void;
  };
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
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc: Document) => {
        const clonedElement = clonedDoc.body;
        const images = clonedElement.querySelectorAll('img');
        images.forEach((img) => {
          if (img.src && (img.src.startsWith('http://') || img.src.startsWith('https://'))) {
            img.setAttribute('crossorigin', 'anonymous');
          }
        });
        
        const overflowElements = clonedElement.querySelectorAll('.overflow-x-auto');
        overflowElements.forEach((el) => {
          el.classList.remove('overflow-x-auto');
          (el as HTMLElement).style.overflow = 'visible';
        });
      }
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    const activityEvent = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    document.dispatchEvent(activityEvent);
    
    await html2pdf()
      .set(finalOptions)
      .from(element)
      .save();
      
    document.dispatchEvent(activityEvent);
  } catch (error) {
    console.error('Error generating PDF:', error);
    const activityEvent = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    document.dispatchEvent(activityEvent);
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
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc: Document) => {
        const clonedElement = clonedDoc.body;
        const images = clonedElement.querySelectorAll('img');
        images.forEach((img) => {
          if (img.src && (img.src.startsWith('http://') || img.src.startsWith('https://'))) {
            img.setAttribute('crossorigin', 'anonymous');
          }
        });
        
        const overflowElements = clonedElement.querySelectorAll('.overflow-x-auto');
        overflowElements.forEach((el) => {
          el.classList.remove('overflow-x-auto');
          (el as HTMLElement).style.overflow = 'visible';
        });
      }
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  return downloadElementAsPDF(invoiceElement, options);
};