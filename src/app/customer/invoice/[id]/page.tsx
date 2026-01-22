"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CustomerLayout } from "@/components/customerSection";
import { UploadReceiptModal } from "@/components/modals";
import { ApiClient } from "@/lib/api";
import { useInvoiceById } from "@/hooks/useCustomerInvoices";

const EmailInvoicePage = () => {
    const params = useParams();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    
    const invoiceId = params.id as string;
    
    // Use custom hook for invoice data
    const { invoice, loading, error } = useInvoiceById(invoiceId);

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
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
                        <p className="text-gray-600 mb-4">{error || "The requested invoice could not be found."}</p>
                        <button 
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                {/* Header with Back Button and Upload Button */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    {/* Back Button with Arrow */}
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-[#2F80ED] hover:text-blue-600 transition-colors"
                    >
                        <svg 
                            className="w-5 h-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                            />
                        </svg>
                    </button>

                    {/* Upload Receipt Button - always show */}
                    <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm md:text-base"
                    >
                        <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                            />
                        </svg>
                        <span>Upload Receipt</span>
                    </button>
                </div>

                {/* Invoice Content - White background */}
                <div className="bg-white rounded-lg shadow-sm relative overflow-hidden">
                    {/* Watermark for unpaid invoices */}
                    {invoice.status.toLowerCase() !== 'paid' && (
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
                                {invoice.status.toUpperCase()}
                            </div>
                        </div>
                    )}
                    
                    <div className="px-4 md:px-12 py-4 relative z-20">
                        {/* Invoice Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 md:mb-12 gap-4">
                            <div className="flex items-center mt-4 md:mt-8">
                                {invoice.logoUrl ? (
                                    <img 
                                        src={invoice.logoUrl} 
                                        alt="Company Logo" 
                                        className="max-h-16 w-auto object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl md:text-4xl font-medium text-black">Logo</span>
                                )}
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                                <h1 className="text-xl md:text-[28px] text-gray-900 mb-2">{invoice.title || 'INVOICE'}</h1>
                                <div className="mb-4">
                                    <div className="flex justify-between sm:justify-end gap-4 mb-2">
                                        <span className="text-sm text-gray-600">#{invoice.invoiceNumber}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between sm:justify-end gap-4 mb-2">
                                        <span className="text-sm text-gray-600">Balance Due</span>
                                    </div>
                                    <div className="flex justify-between sm:justify-end gap-4">
                                        <span className="text-lg font-bold text-gray-900">{formatCurrency(balanceDue)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="flex justify-end mb-6 md:mb-8">
                            <div className="w-full sm:w-auto sm:inline-block text-left space-y-2">
                                <div className="flex justify-between gap-4 sm:gap-16">
                                    <span className="text-sm text-gray-600">Invoice Date</span>
                                    <span className="text-sm text-gray-900 font-medium">{formatDate(invoice.creationDate)}</span>
                                </div>
                                {invoice.paymentTerms && (
                                    <div className="flex justify-between gap-4 sm:gap-16">
                                        <span className="text-sm text-gray-600">Terms</span>
                                        <span className="text-sm text-gray-900 font-medium">{invoice.paymentTerms}</span>
                                    </div>
                                )}
                                <div className="flex justify-between gap-4 sm:gap-16">
                                    <span className="text-sm text-gray-600">Due Date</span>
                                    <span className="text-sm text-gray-900 font-medium">{formatDate(invoice.dueDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bill To/From */}
                        <div className="mb-5">
                            <div className="flex flex-col sm:flex-row justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill From</h3>
                                    <p className="text-gray-900 font-medium">{invoice.billFrom.fullName}</p>
                                    {invoice.billFrom.address && (
                                        <p className="text-gray-600 text-sm">{invoice.billFrom.address}</p>
                                    )}
                                    <p className="text-gray-600 text-sm">{invoice.billFrom.email}</p>
                                    {invoice.billFrom.phone && (
                                        <p className="text-gray-600 text-sm">{invoice.billFrom.phone}</p>
                                    )}
                                </div>
                                <div className="flex-1 sm:text-right">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To</h3>
                                    <p className="text-gray-900 font-medium">{invoice.billTo.fullName}</p>
                                    {invoice.billTo.businessName && (
                                        <p className="text-gray-600 text-sm">{invoice.billTo.businessName}</p>
                                    )}
                                    <p className="text-gray-600 text-sm">{invoice.billTo.email}</p>
                                    {invoice.billTo.phone && (
                                        <p className="text-gray-600 text-sm">{invoice.billTo.phone}</p>
                                    )}
                                    {invoice.billTo.country && (
                                        <p className="text-gray-600 text-sm">{invoice.billTo.country}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-6 md:mb-8 overflow-x-auto">
                            <table className="w-full border-collapse min-w-[400px]">
                                <thead>
                                    <tr className="bg-[#F8F8FA]">
                                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-600 border border-gray-200 w-10 md:w-16">#</th>
                                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-600 border border-gray-200">Item Detail</th>
                                        <th className="text-right py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-600 border border-gray-200 w-16 md:w-24">Qty</th>
                                        <th className="text-right py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-600 border border-gray-200 w-20 md:w-32">Rate</th>
                                        <th className="text-right py-3 px-2 md:px-4 text-xs md:text-sm font-medium text-gray-600 border border-gray-200 w-24 md:w-32">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-900 border border-gray-200">{index + 1}</td>
                                            <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm text-gray-900 border border-gray-200">
                                                <div>
                                                    <p className="font-medium">{item.itemName}</p>
                                                    {item.description && (
                                                        <p className="text-xs md:text-sm text-gray-600 hidden sm:block">{item.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 md:py-4 px-2 md:px-4 text-right text-xs md:text-sm text-gray-900 border border-gray-200">{item.quantity}</td>
                                            <td className="py-3 md:py-4 px-2 md:px-4 text-right text-xs md:text-sm text-gray-900 border border-gray-200">{item.rate.toLocaleString()}</td>
                                            <td className="py-3 md:py-4 px-2 md:px-4 text-right text-xs md:text-sm text-gray-900 font-medium border border-gray-200">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-8 md:mb-12 text-sm md:text-[16px]">
                            <div className="w-full sm:w-80">
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Sub Total</span>
                                    <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                {invoice.appliedTaxes && invoice.appliedTaxes.map((tax) => (
                                    <div key={tax.taxId} className="flex justify-between py-1">
                                        <span className="text-gray-600">{tax.taxName}</span>
                                        <span className="text-gray-900">{formatCurrency(tax.taxAmount)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-900 font-medium">Total</span>
                                    <span className="text-gray-900 font-medium">{formatCurrency(invoice.totalDue)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-blue-50 px-4 rounded-lg mt-1">
                                    <span className="text-gray-900 font-medium">Balance Due</span>
                                    <span className="text-gray-900 font-medium">{formatCurrency(balanceDue)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="mb-8 md:mb-12">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Signature</h3>
                            {invoice.signatureUrl ? (
                                <img 
                                    src={invoice.signatureUrl} 
                                    alt="Signature" 
                                    className="max-h-16 w-auto object-contain"
                                />
                            ) : (
                                <div className="text-gray-600 italic">—{invoice.billFrom.fullName}</div>
                            )}
                        </div>

                        {/* Note */}
                        {invoice.note && (
                            <div className="mb-6 md:mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                                <p className="text-gray-600 text-sm">{invoice.note}</p>
                            </div>
                        )}

                        {/* Terms of Payment */}
                        {invoice.termsAndConditions && (
                            <div className="mb-6 md:mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                                <p className="text-gray-600 text-sm">{invoice.termsAndConditions}</p>
                            </div>
                        )}

                        {/* Payment Method */}
                        {(invoice.bank || invoice.accountNumber || invoice.accountName) && (
                            <div className="mb-6 md:mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Method: Bank Transfer</h3>
                                <div className="space-y-3">
                                    {invoice.bank && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 text-sm">Bank Name:</span>
                                            <span className="text-gray-900 font-medium text-sm">{invoice.bank}</span>
                                        </div>
                                    )}
                                    {invoice.accountNumber && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 text-sm">Account Number</span>
                                            <span className="text-gray-900 font-medium text-sm">{invoice.accountNumber}</span>
                                        </div>
                                    )}
                                    {invoice.accountName && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 text-sm">Account Name</span>
                                            <span className="text-gray-900 font-medium text-sm">{invoice.accountName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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
                    onClose={handleModalClose}
                    onUpload={handleUploadReceipt}
                    invoiceId={invoiceId}
                />
            </div>
        </CustomerLayout>
    );
};

export default EmailInvoicePage;