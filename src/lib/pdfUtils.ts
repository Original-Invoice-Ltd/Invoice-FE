import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';


export const downloadInvoiceAsPDF = async (
  invoiceElement: HTMLElement,
  invoiceNumber?: string,
  isFreePlan: boolean = false
): Promise<void> => {
  if (!invoiceElement) {
    throw new Error('Invoice element is required for PDF generation');
  }

  try {
    const filename = invoiceNumber 
      ? `invoice-${invoiceNumber}.pdf` 
      : `invoice-${new Date().toISOString().split('T')[0]}.pdf`;
    
    const a4WidthPx = 794;
    
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = `${a4WidthPx}px`;
    tempContainer.style.minWidth = `${a4WidthPx}px`;
    tempContainer.style.overflow = 'visible';
    tempContainer.style.zIndex = '-1';
    document.body.appendChild(tempContainer);
    
    const clonedElement = invoiceElement.cloneNode(true) as HTMLElement;
    
    clonedElement.style.width = `${a4WidthPx}px`;
    clonedElement.style.minWidth = `${a4WidthPx}px`;
    clonedElement.style.maxWidth = `${a4WidthPx}px`;
    clonedElement.style.transform = 'scale(1)';
    clonedElement.style.transformOrigin = 'top left';
    
    const style = document.createElement('style');
    style.textContent = `
      .sm\\:px-8, .sm\\:px-12, .md\\:px-8, .md\\:px-12, .lg\\:px-12 { padding-left: 3rem !important; padding-right: 3rem !important; }
      .sm\\:py-4, .md\\:py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
      .sm\\:text-sm { font-size: 0.875rem !important; }
      .sm\\:text-base { font-size: 1rem !important; }
      .sm\\:text-lg { font-size: 1.125rem !important; }
      .sm\\:text-xl { font-size: 1.25rem !important; }
      .sm\\:text-2xl { font-size: 1.5rem !important; }
      .sm\\:text-3xl { font-size: 1.875rem !important; }
      .sm\\:text-4xl { font-size: 2.25rem !important; }
      .md\\:text-sm { font-size: 0.875rem !important; }
      .md\\:text-base { font-size: 1rem !important; }
      .md\\:text-lg { font-size: 1.125rem !important; }
      .md\\:text-xl { font-size: 1.25rem !important; }
      .md\\:text-2xl { font-size: 1.5rem !important; }
      .md\\:text-3xl { font-size: 1.875rem !important; }
      .md\\:text-4xl { font-size: 2.25rem !important; }
      .lg\\:text-sm { font-size: 0.875rem !important; }
      .lg\\:text-base { font-size: 1rem !important; }
      .lg\\:text-lg { font-size: 1.125rem !important; }
      .lg\\:text-xl { font-size: 1.25rem !important; }
      .lg\\:text-2xl { font-size: 1.5rem !important; }
      .lg\\:text-3xl { font-size: 1.875rem !important; }
      .lg\\:text-4xl { font-size: 2.25rem !important; }
      .sm\\:flex, .md\\:flex, .lg\\:flex { display: flex !important; }
      .sm\\:block, .md\\:block, .lg\\:block { display: block !important; }
      .sm\\:hidden, .md\\:hidden, .lg\\:hidden { display: none !important; }
      .sm\\:inline, .md\\:inline, .lg\\:inline { display: inline !important; }
      .sm\\:grid, .md\\:grid, .lg\\:grid { display: grid !important; }
      .sm\\:flex-row, .md\\:flex-row, .lg\\:flex-row { flex-direction: row !important; }
      .sm\\:flex-col, .md\\:flex-col, .lg\\:flex-col { flex-direction: column !important; }
      .sm\\:gap-4, .md\\:gap-4, .lg\\:gap-4 { gap: 1rem !important; }
      .sm\\:gap-6, .md\\:gap-6, .lg\\:gap-6 { gap: 1.5rem !important; }
      .sm\\:gap-8, .md\\:gap-8, .lg\\:gap-8 { gap: 2rem !important; }
      .sm\\:mb-4, .md\\:mb-4, .lg\\:mb-4 { margin-bottom: 1rem !important; }
      .sm\\:mb-6, .md\\:mb-6, .lg\\:mb-6 { margin-bottom: 1.5rem !important; }
      .sm\\:mb-8, .md\\:mb-8, .lg\\:mb-8 { margin-bottom: 2rem !important; }
      .sm\\:mb-12, .md\\:mb-12, .lg\\:mb-12 { margin-bottom: 3rem !important; }
      .sm\\:h-16, .md\\:h-16, .lg\\:h-16 { height: 4rem !important; }
      .sm\\:w-auto, .md\\:w-auto, .lg\\:w-auto { width: auto !important; }
      .hidden { display: none !important; }
    `;
    tempContainer.appendChild(style);
    tempContainer.appendChild(clonedElement);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const height = clonedElement.scrollHeight;

    const dataUrl = await toPng(clonedElement, {
      quality: 1.0,
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#ffffff',
      width: a4WidthPx,
      height: height,
    });

    document.body.removeChild(tempContainer);

    const pdfWidth = 210;
    const pdfHeight = (height * pdfWidth) / a4WidthPx;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);

    if (isFreePlan) {
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(50);
      pdf.setFont('helvetica', 'bold');
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const watermarkText = 'originalinvoice.com';
      pdf.saveGraphicsState();
      pdf.setGState(new pdf.GState({ opacity: 0.15 }));
      
      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;
      pdf.text(watermarkText, centerX, centerY, {
        angle: 45,
        align: 'center',
        baseline: 'middle'
      });
      
      pdf.restoreGraphicsState();
    }
    
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    const footerText = 'Generated by originalinvoice.com';
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.text(footerText, pageWidth / 2, pageHeight - 5, {
      align: 'center'
    });

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const printInvoiceAsPDF = downloadInvoiceAsPDF;
