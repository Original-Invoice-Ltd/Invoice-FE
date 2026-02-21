export interface PDFOptions {
  filename?: string;
  margin?: number | [number, number] | [number, number, number, number];
  image?: { type: 'jpeg' | 'png' | 'webp'; quality: number };
  html2canvas?: { 
    scale?: number; 
    useCORS?: boolean; 
    logging?: boolean; 
    backgroundColor?: string; 
    windowWidth?: number;
    onclone?: (clonedDoc: Document) => void;
  };
  jsPDF?: { unit: string; format: string; orientation: 'portrait' | 'landscape' };
}

/**
 * OPTIMIZED: Fixes unsupported modern CSS colors (lab, oklch) for PDF engines.
 * This runs inside the 'onclone' hook of html2canvas.
 */
const fixUnsupportedColors = (clonedDoc: Document) => {
  const clonedElement = clonedDoc.body;

  // 1. Fix images and layout issues in the clone
  const images = clonedElement.querySelectorAll('img');
  images.forEach((img) => {
    if (img.src && img.src.startsWith('http')) {
      img.setAttribute('crossorigin', 'anonymous');
    }
  });

  const overflowElements = clonedElement.querySelectorAll('.overflow-x-auto');
  overflowElements.forEach((el) => {
    (el as HTMLElement).style.overflow = 'visible';
    el.classList.remove('overflow-x-auto');
  });

  // 2. High-speed color conversion
  // We target the most common properties to save CPU cycles
  const allElements = clonedElement.querySelectorAll('*');
  const colorProps = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'];

  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const computedStyle = window.getComputedStyle(el);

    colorProps.forEach((prop) => {
      try {
        const value = computedStyle.getPropertyValue(prop);
        // If the color contains modern syntax, force it to the RGB string
        // that the browser has already calculated in computedStyle.
        if (value && (value.includes('lab') || value.includes('oklch') || value.includes('lch'))) {
          htmlEl.style.setProperty(prop, value, 'important');
        }
      } catch (e) {
        // Silent catch for elements that don't support specific properties
      }
    });
  });
};

export const downloadElementAsPDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  if (!element) throw new Error('Element is required for PDF generation');

  const defaultOptions = {
    filename: 'invoice.pdf',
    margin: [10, 10, 10, 10] as [number, number, number, number],
    image: { type: 'jpeg' as const, quality: 0.95 },
    html2canvas: { 
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: fixUnsupportedColors // Injecting the fix here
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Activity pulse to keep browser responsive
    const pulse = () => document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    
    pulse();
    await html2pdf().set(finalOptions).from(element).save();
    pulse();
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

  return downloadElementAsPDF(invoiceElement, { filename });
};
