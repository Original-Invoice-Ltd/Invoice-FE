export interface PDFOptions {
  filename?: string;
  margin?: number | [number, number, number, number];
  image?: { type: 'jpeg' | 'png' | 'webp'; quality: number };
  html2canvas?: { scale: number; useCORS: boolean; allowTaint?: boolean; backgroundColor?: string };
  jsPDF?: { unit: string; format: string; orientation: 'portrait' | 'landscape' };
}

const sanitizeElementForPDF = (element: HTMLElement): HTMLElement => {
  const clone = element.cloneNode(true) as HTMLElement;
  
  const allElements = [clone, ...clone.querySelectorAll('*')] as HTMLElement[];
  
  allElements.forEach((el) => {
    const computedStyle = window.getComputedStyle(el);
    const inlineStyles: string[] = [];
    
    const colorProperties = [
      'color', 'backgroundColor', 'borderColor', 'borderTopColor', 
      'borderRightColor', 'borderBottomColor', 'borderLeftColor',
      'outlineColor', 'textDecorationColor', 'caretColor'
    ];
    
    colorProperties.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') {
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        inlineStyles.push(`${cssProp}: ${value}`);
      }
    });
    
    if (inlineStyles.length > 0) {
      const existingStyle = el.getAttribute('style') || '';
      const newStyle = existingStyle + '; ' + inlineStyles.join('; ');
      el.setAttribute('style', newStyle);
    }
  });
  
  return clone;
};

export const downloadElementAsPDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  if (!element) {
    throw new Error('Element is required for PDF generation');
  }

  const defaultOptions = {
    filename: 'invoice.pdf',
    margin: 10,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const html2pdf = (await import('html2pdf.js')).default;    
    const sanitizedElement = sanitizeElementForPDF(element);
    sanitizedElement.style.position = 'absolute';
    sanitizedElement.style.left = '-9999px';
    sanitizedElement.style.top = '-9999px';
    document.body.appendChild(sanitizedElement);

    try {
      await html2pdf()
        .set(finalOptions)
        .from(sanitizedElement)
        .save();
    } finally {
      document.body.removeChild(sanitizedElement);
    }
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
    margin: [10, 10, 10, 10],
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  return downloadElementAsPDF(invoiceElement, options);
};