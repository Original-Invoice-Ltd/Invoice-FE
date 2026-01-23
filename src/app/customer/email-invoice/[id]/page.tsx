"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CustomerLayout } from "@/components/customerSection";
import { UploadReceiptModal } from "@/components/modals";
import { ApiClient } from "@/lib/api";
import { usePublicInvoiceByUuid } from "@/hooks/useCustomerInvoices";

const EmailInvoicePage = () => {
    const params = useParams();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    
    const invoiceUuid = params.id as string;
    
    // Use custom hook for public invoice data
    const { invoice, loading, error } = usePublicInvoiceByUuid(invoiceUuid);

    const handleUploadReceipt = (file: File) => {
        console.log('Uploaded file:', file);
        // The actual upload is handled by the modal with the API
    };

    const handleModalClose = () => {
        setIsUploadModalOpen(false);
    };

    const formatCurrency = (amount: number) => {
        return invoice ? ApiClient.formatCurrency(amount, invoice.currency) : ApiClient.formatCurrency(amount, '₦');
    };

    const formatDate = (dateString: string) => {
        return ApiClient.formatDate(dateString);
    };

    const getStatusColor = (status: string) => {
        return ApiClient.getStatusColor(status) + ' px-3 py-1 rounded-full text-xs font-medium border';
    };

    if (loading) {
        return (
            <CustomerLayout showEmailProfile={true}>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading invoice...</p>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    if (error || !invoice) {
        return (
            <CustomerLayout showEmailProfile={true}>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center max-w-md mx-auto px-4">
                        {/* Empty State SVG */}
                        <div className="mb-6">
                            <Image 
                                src="/assets/icons/emptyInvoicesStates.svg" 
                                alt="Invoice Not Found" 
                                width={192}
                                height={192}
                                className="mx-auto"
                            />
                        </div>
                        
                        {/* Error Message */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Not Found</h2>
                        <p className="text-gray-600 mb-6">
                            {error || "The requested invoice could not be found. It may have been deleted or the link is invalid."}
                        </p>
                        
                        {/* Back Button */}
                        <button 
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    // Calculate balance due (for unpaid invoices, it's the total due)
    const balanceDue = invoice.status.toLowerCase() === 'paid' ? 0 : invoice.totalDue;

    return (
        <CustomerLayout showEmailProfile={true}>
            <div className="max-w-5xl mx-auto p-4 md:p-6">
                {/* Upload Receipt Button */}
                <div className="mb-4 md:mb-6 flex justify-end">
                    <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm md:text-base"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="hidden sm:inline">Upload Receipt</span>
                        <span className="sm:hidden">Upload</span>
                    </button>
                </div>

                {/* Invoice Content - White background */}
                <div className="bg-white rounded-lg shadow-sm relative overflow-hidden">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div 
                            className="text-orange-100 font-bold select-none"
                            style={{
                                fontSize: 'clamp(60px, 15vw, 120px)',
                                transform: 'rotate(-45deg)',
                                opacity: 0.1,
                                letterSpacing: '8px'
                            }}
                        >
                            UNPAID
                        </div>
                    </div>
                    
                    <div className="px-4 md:px-12 py-4 relative z-20">
                        {/* Invoice Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 md:mb-12 gap-4">
                            <div className="flex items-center mt-4 md:mt-8">
                                <span className="text-2xl md:text-4xl font-medium text-black">Logo</span>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                                <h1 className="text-xl md:text-[28px] text-gray-900 mb-2">INVOICE</h1>
                                <div className="mb-4">
                                    <div className="flex justify-between sm:justify-end gap-4 mb-2">
                                        <span className="text-sm text-gray-600">#{invoice.invoiceNumber}</span>
                                    </div>
                                    <div className="flex justify-between sm:justify-end gap-4 mb-2">
                                        <span className="text-sm text-gray-600">Balance Due</span>
                                    </div>
                                    <div className="flex justify-between sm:justify-end gap-4">
                                        <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.balanceDue)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bill To/From and Invoice Details */}
                        <div className="mb-8">
                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                {/* Left side - Bill To */}
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To</h3>
                                    <p className="text-gray-900 font-medium">{invoice.billTo.fullName}</p>
                                    <p className="text-gray-600 text-sm">{invoice.billTo.location}</p>
                                    <p className="text-gray-600 text-sm">{invoice.billTo.email}</p>
                                </div>

                                {/* Right side - Bill From and Invoice Details */}
                                <div className="flex-1">
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill From</h3>
                                        <p className="text-gray-900 font-medium">{invoice.billFrom.fullName}</p>
                                        <p className="text-gray-600 text-sm">{invoice.billFrom.location}</p>
                                        <p className="text-gray-600 text-sm">{invoice.billFrom.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details Table */}
                        <div className="mb-8">
                            <div className="bg-[#2F80ED] text-white rounded-t-lg">
                                <div className="grid grid-cols-3 gap-4 p-4 text-sm font-medium">
                                    <div>Invoice Date</div>
                                    <div className="text-center">Payment Terms</div>
                                    <div className="text-right">Due Date</div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-b-lg">
                                <div className="grid grid-cols-3 gap-4 p-4 text-sm">
                                    <div>{formatDate(invoice.creationDate)}</div>
                                    <div className="text-center">{invoice.paymentTerms}</div>
                                    <div className="text-right">{formatDate(invoice.dueDate)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8 overflow-x-auto">
                            <table className="w-full border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200">#</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200">Item Detail</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200">Qty</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200">Rate</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="py-4 px-4 text-sm text-gray-900 border border-gray-200">{index + 1}</td>
                                            <td className="py-4 px-4 text-sm text-gray-900 border border-gray-200">
                                                <p className="font-medium">{item.itemName}</p>
                                            </td>
                                            <td className="py-4 px-4 text-right text-sm text-gray-900 border border-gray-200">{item.quantity}</td>
                                            <td className="py-4 px-4 text-right text-sm text-gray-900 border border-gray-200">{item.rate.toLocaleString()}</td>
                                            <td className="py-4 px-4 text-right text-sm text-gray-900 font-medium border border-gray-200">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-8">
                            <div className="w-full sm:w-80">
                                <div className="space-y-2">
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600">Sub Total</span>
                                        <span className="text-gray-900">{invoice.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600">VAT (7.5%)</span>
                                        <span className="text-gray-900">{invoice.vatAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-gray-600">WHT (5%)</span>
                                        <span className="text-gray-900">{invoice.whtAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-t">
                                        <span className="text-gray-900 font-medium">Total</span>
                                        <span className="text-gray-900 font-medium">{formatCurrency(invoice.totalDue)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 bg-blue-500 text-white px-4 rounded-lg">
                                        <span className="font-medium">Balance Due</span>
                                        <span className="font-medium">{formatCurrency(invoice.balanceDue)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Signature</h3>
                            <div className="text-gray-600 italic">—Chiamaka</div>
                        </div>

                        {/* Note */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                            <p className="text-gray-600 text-sm">{invoice.note}</p>
                        </div>

                        {/* Terms of Payment */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                            <p className="text-gray-600 text-sm">{invoice.termsAndConditions}</p>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Method: Bank Transfer</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Bank Name:</span>
                                    <span className="text-gray-900 font-medium text-sm">{invoice.bank}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Account Number</span>
                                    <span className="text-gray-900 font-medium text-sm">{invoice.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Account Name</span>
                                    <span className="text-gray-900 font-medium text-sm">{invoice.accountName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6">
                            <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upload Receipt Modal */}
                <UploadReceiptModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={handleUploadReceipt}
                />
            </div>
        </CustomerLayout>
    );
};

export default EmailInvoicePage;