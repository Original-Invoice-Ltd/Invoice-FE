// /**
//  * Uses browser's native print dialog to save as PDF.
//  * This is the most reliable method - no color parsing issues, no library dependencies.
//  */
// export const printInvoiceAsPDF = (invoiceElement: HTMLElement, invoiceNumber?: string): void => {
//   if (!invoiceElement) {
//     throw new Error('Invoice element is required');
//   }

//   // Store original body content
//   const originalContents = document.body.innerHTML;
//   const originalTitle = document.title;

//   // Set document title for the PDF filename suggestion
//   if (invoiceNumber) {
//     document.title = `Invoice-${invoiceNumber}`;
//   }

//   // Replace body with just the invoice content
//   document.body.innerHTML = invoiceElement.outerHTML;

//   // Add print-specific styles
//   const style = document.createElement('style');
//   style.textContent = `
//     @media print {
//       body {
//         margin: 0;
//         padding: 20px;
//       }
//       @page {
//         margin: 10mm;
//         size: A4;
//       }
//       /* Hide elements that shouldn't be printed */
//       button, .no-print {
//         display: none !important;
//       }
//       /* Ensure colors print */
//       * {
//         -webkit-print-color-adjust: exact !important;
//         print-color-adjust: exact !important;
//         color-adjust: exact !important;
//       }
//     }
//   `;
//   document.head.appendChild(style);

//   // Trigger print dialog
//   window.print();

//   // Restore original content after print dialog closes
//   setTimeout(() => {
//     document.body.innerHTML = originalContents;
//     document.title = originalTitle;
//     style.remove();
//     // Re-trigger React hydration by reloading
//     window.location.reload();
//   }, 100);
// };

// export const downloadInvoiceAsPDF = (
//   invoiceElement: HTMLElement,
//   invoiceNumber?: string
// ): Promise<void> => {
//   return Promise.resolve(printInvoiceAsPDF(invoiceElement, invoiceNumber));
// };
