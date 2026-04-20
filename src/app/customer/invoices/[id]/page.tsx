"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CustomerLayout } from "@/components/customerSection";
import { UploadReceiptModal } from "@/components/modals";
import { ApiClient } from "@/lib/api";
import { Eye, X } from "lucide-react";
import { formatCurrency as formatCurrencyUtil, CurrencyCode } from "@/lib/currencyFormatter";
import { downloadInvoiceAsPDF } from "@/lib/pdfUtils";

const InvoiceDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (params.id) {
            fetchInvoice(params.id as string);
        }
    }, [params.id]);

    const fetchInvoice = async (invoiceId: string) => {
        try {
            setLoading(true);
            const response = await ApiClient.getInvoiceById(invoiceId);

            if (response.status === 200 && response.data) {
                setInvoice(response.data);
            } else {
                setError('Failed to load invoice');
            }
        } catch (err) {
            console.error("Error fetching invoice:", err);
            setError('An error occurred while loading the invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadReceipt = (file: File) => {
        console.log('Uploaded file:', file);
        // The actual upload is handled by the modal with the API
    };

    const handleModalClose = () => {
        setIsUploadModalOpen(false);
    };

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current || !invoice) return;
        setIsDownloadingPDF(true);
        try {
            await downloadInvoiceAsPDF(invoiceRef.current, invoice.invoiceNumber || 'invoice');
        } catch (err) {
            console.error('Failed to download PDF:', err);
        } finally {
            setIsDownloadingPDF(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return formatCurrencyUtil(amount, { currency: (invoice?.currency || 'NGN') as CurrencyCode });
    };

    const formatDate = (dateString: string) => {
        return ApiClient.formatDate(dateString);
    };

    const getStatusColor = (status: string) => {
        return ApiClient.getStatusColor(status) + ' px-3 py-1 rounded-full text-xs font-medium border';
    };

    if (loading) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </CustomerLayout>
        );
    }

    if (error || !invoice) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
                        <p className="text-gray-600 mb-4">{error || "The invoice you're looking for doesn't exist."}</p>
                        <button
                            onClick={() => router.push('/customer/invoices')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Invoices
                        </button>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <div className="max-w-5xl mx-auto p-4 md:p-6">
                {/* Header with Back Button and Upload Button */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    {/* Back Button with Arrow */}
                    <button
                        onClick={() => router.back()}
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

                {/* Invoice Content */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden my-4 sm:my-8" ref={invoiceRef}>
                    {invoice?.status?.toLowerCase() !== 'paid' && (
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
                                {invoice.status?.toUpperCase()}
                            </div>
                        </div>
                    )}

                    <div className="px-6 py-8 md:px-16 md:py-12 relative z-20">
                        {/* Invoice Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 md:mb-12 gap-4">
                            <div className="flex items-center mt-4 md:mt-8">
                                <span className="text-2xl md:text-4xl font-medium text-black">Logo</span>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                                <h1 className="text-xl md:text-[28px] text-gray-900 mb-2">INVOICE</h1>
                                <p className="text-gray-600 mb-1">#{invoice?.invoiceNumber}</p>
                                <div className="mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice?.status || 'UNPAID')}`}>
                                        {invoice?.status || 'UNPAID'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Section */}
                        <div className="mb-8">
                            {/* Bill From and Bill To Section - Side by Side with Space Between */}
                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                {/* Bill From */}
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-[#101828] mb-3">Bill From</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-[#101828]">{invoice.billFrom?.fullName || invoice.billFrom?.businessName}</p>
                                        {invoice.billFrom?.address && (
                                            <p className="text-sm text-[#667085]">{invoice.billFrom.address}</p>
                                        )}
                                        <p className="text-sm text-[#667085]">{invoice.billFrom?.email}</p>
                                        {invoice.billFrom?.phone && (
                                            <p className="text-sm text-[#667085]">{invoice.billFrom.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Bill To */}
                                <div className="flex-1 md:text-right">
                                    <h3 className="text-sm font-semibold text-[#101828] mb-3">Bill To</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-[#101828]">
                                            {invoice.billTo?.businessName || invoice.billTo?.fullName}
                                        </p>
                                        {invoice.billTo?.country && (
                                            <p className="text-sm text-[#667085]">{invoice.billTo.country}</p>
                                        )}
                                        <p className="text-sm text-[#667085]">{invoice.billTo?.email}</p>
                                        {invoice.billTo?.phone && (
                                            <p className="text-sm text-[#667085]">{invoice.billTo.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Details - Full Width with Space Between */}
                            <div className="w-full">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#667085]">Invoice</span>
                                        <span className="text-sm font-medium text-[#101828]">#{invoice.invoiceNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#667085]">Invoice Date</span>
                                        <span className="text-sm font-medium text-[#101828]">{formatDate(invoice.creationDate)}</span>
                                    </div>
                                    {invoice.paymentTerms && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#667085]">Terms</span>
                                            <span className="text-sm font-medium text-[#101828]">{invoice.paymentTerms}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#667085]">Due Date</span>
                                        <span className="text-sm font-medium text-[#101828]">{formatDate(invoice.dueDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr style={{ backgroundColor: invoice?.invoiceColor ? `${invoice.invoiceColor}20` : '#EBF5FF' }}>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD] w-12">#</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD]">Item Detail</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD] w-20">Qty</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD] w-32">Rate</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD] w-32">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice?.items?.map((item: any, index: number) => (
                                        <tr key={item.id || index}>
                                            <td className="py-3 px-4 text-sm text-[#101828] border border-[#D0D5DD]">{index + 1}</td>
                                            <td className="py-3 px-4 text-sm text-[#101828] border border-[#D0D5DD]">
                                                <div className="font-medium">{item.itemName}</div>
                                                {item.description && (
                                                    <div className="mt-1">
                                                        {/* Desktop: Show full description */}
                                                        <div className="hidden md:block text-xs text-[#667085]">
                                                            {item.description}
                                                        </div>
                                                        {/* Mobile: Show truncated with eye button if long */}
                                                        <div className="md:hidden">
                                                            {item.description.length > 50 ? (
                                                                <div className="flex items-start gap-2">
                                                                    <span className="text-xs text-[#667085] line-clamp-1 flex-1">
                                                                        {item.description}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => setSelectedDescription(item.description || null)}
                                                                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                                                                        title="View full description"
                                                                    >
                                                                        <Eye size={14} className="text-[#2F80ED]" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs text-[#667085]">
                                                                    {item.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-[#101828] text-right border border-[#D0D5DD]">{item.quantity}</td>
                                            <td className="py-3 px-4 text-sm text-[#101828] text-right border border-[#D0D5DD]">
                                                {formatCurrency(item.rate)}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-[#101828] text-right border border-[#D0D5DD]">
                                                {formatCurrency(item.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals Section - Right Aligned */}
                    <div className="flex justify-end mb-8">
                        <div className="w-full md:w-80">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#667085]">Sub Total</span>
                                    <span className="text-[#101828] font-medium">
                                        {formatCurrency(invoice.subtotal || 0)}
                                    </span>
                                </div>
                                {invoice.appliedTaxes?.map((tax: any, index: number) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span className="text-[#667085]">
                                            {tax.taxName} ({tax.appliedRate}%)
                                        </span>
                                        <span className="text-[#101828] font-medium">
                                            {formatCurrency(tax.taxAmount)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-sm pt-2 border-t border-[#E4E7EC]">
                                    <span className="text-[#101828] font-semibold">Total</span>
                                    <span className="text-[#101828] font-semibold">
                                        {formatCurrency(invoice.totalDue || 0)}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-3 px-4 py-3 rounded" style={{ backgroundColor: invoice?.invoiceColor ? `${invoice.invoiceColor}20` : '#EBF5FF' }}>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-[#101828]">Balance Due</span>
                                    <span className="text-base font-bold text-[#101828]">
                                        {formatCurrency(invoice?.totalDue || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    {invoice.signatureUrl && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-[#101828] mb-3">Signature</h3>
                            <img
                                src={invoice.signatureUrl}
                                alt="Signature"
                                className="h-16 w-auto"
                            />
                        </div>
                    )}

                    {/* Notes and Terms */}
                    {(invoice.note || invoice.termsAndConditions || invoice.bank || invoice.accountNumber || invoice.accountName) && (
                        <div className="space-y-6">
                            {invoice.note && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[#101828] mb-2">Note</h3>
                                    <p className="text-sm text-[#667085]">{invoice.note}</p>
                                </div>
                            )}

                            {invoice.termsAndConditions && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[#101828] mb-2">Terms of Payment</h3>
                                    <p className="text-sm text-[#667085]">{invoice.termsAndConditions}</p>
                                </div>
                            )}

                            {(invoice.bank || invoice.accountNumber || invoice.accountName) && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[#101828] mb-4">Payment Method: Bank Transfer</h3>
                                    <div className="space-y-3">
                                        {invoice.bank && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-[#667085]">Bank Name:</span>
                                                <span className="text-sm text-[#101828] font-medium">{invoice.bank}</span>
                                            </div>
                                        )}
                                        {invoice.accountNumber && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-[#667085]">Account Number</span>
                                                <span className="text-sm text-[#101828] font-medium">{invoice.accountNumber}</span>
                                            </div>
                                        )}
                                        {invoice.accountName && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-[#667085]">Account Name</span>
                                                <span className="text-sm text-[#101828] font-medium">{invoice.accountName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-[#E4E7EC] mt-12">
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-blue-50 transition-colors text-sm md:text-base font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload Receipt
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloadingPDF}
                            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloadingPDF ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Description Modal */}
            {selectedDescription && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[#101828]">Item Description</h3>
                            <button
                                onClick={() => setSelectedDescription(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="text-sm text-[#667085] whitespace-pre-wrap">
                            {selectedDescription}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedDescription(null)}
                                className="px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Receipt Modal */}
            <UploadReceiptModal
                isOpen={isUploadModalOpen}
                onClose={handleModalClose}
                onUpload={handleUploadReceipt}
                invoiceId={params.id as string}
            />
        </CustomerLayout>
    );
};

export default InvoiceDetailPage;