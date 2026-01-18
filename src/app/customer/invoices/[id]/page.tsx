"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CustomerLayout } from "@/components/customerSection";
import { UploadReceiptModal } from "@/components/modals";
import { getInvoiceById } from "@/lib/mockData";

const InvoiceDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    
    const invoiceId = parseInt(params.id as string);
    const invoice = getInvoiceById(invoiceId);

    const handleUploadReceipt = (file: File) => {
        console.log('Uploaded file:', file);
        alert(`Receipt "${file.name}" uploaded successfully!`);
    };

    if (!invoice) {
        return (
            <CustomerLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h1>
                        <p className="text-gray-600 mb-4">The invoice you're looking for doesn't exist.</p>
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

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'overdue':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <CustomerLayout>
            <div className="max-w-5xl mx-auto p-4 md:p-6">
                {/* Back Button */}
                <div className="mb-4">
                    <button
                        onClick={() => router.push('/customer/invoices')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Invoices
                    </button>
                </div>

                {/* Upload Receipt Button */}
                {invoice.status.toLowerCase() !== 'paid' && (
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
                )}

                {/* Invoice Content */}
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
                                <span className="text-2xl md:text-4xl font-medium text-black">Logo</span>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                                <h1 className="text-xl md:text-[28px] text-gray-900 mb-2">INVOICE</h1>
                                <p className="text-gray-600 mb-1">#{invoice.invoiceId}</p>
                                <div className="mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </div>
                                <p className="text-[14px] text-gray-500 mb-2">Balance Due</p>
                                <p className="text-[16px] font-semibold text-gray-900">{formatCurrency(invoice.totals.balanceDue)}</p>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="flex justify-end mb-6 md:mb-8">
                            <div className="w-full sm:w-auto sm:inline-block text-left space-y-2">
                                <div className="flex justify-between gap-4 sm:gap-16">
                                    <span className="text-sm text-gray-600">Invoice Date</span>
                                    <span className="text-sm text-gray-900 font-medium">{formatDate(invoice.dates.invoiceDate)}</span>
                                </div>
                                {invoice.dates.paymentTerms && (
                                    <div className="flex justify-between gap-4 sm:gap-16">
                                        <span className="text-sm text-gray-600">Terms</span>
                                        <span className="text-sm text-gray-900 font-medium">{invoice.dates.paymentTerms}</span>
                                    </div>
                                )}
                                <div className="flex justify-between gap-4 sm:gap-16">
                                    <span className="text-sm text-gray-600">Due Date</span>
                                    <span className="text-sm text-gray-900 font-medium">{formatDate(invoice.dates.dueDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bill To/From */}
                        <div className="mb-5">
                            <div className="flex flex-col sm:flex-row justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill From</h3>
                                    <p className="text-gray-900 font-medium">{invoice.billFrom.company}</p>
                                    <p className="text-gray-600 text-sm">{invoice.billFrom.email}</p>
                                </div>
                                <div className="flex-1 sm:text-right">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To</h3>
                                    <p className="text-gray-900 font-medium">{invoice.billTo.name}</p>
                                    <p className="text-gray-600 text-sm">{invoice.billTo.location}</p>
                                    <p className="text-gray-600 text-sm">{invoice.billTo.email}</p>
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
                                                    <p className="font-medium">{item.description}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 md:py-4 px-2 md:px-4 text-right text-xs md:text-sm text-gray-900 border border-gray-200">{item.qty}</td>
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
                                    <span className="text-gray-900">{formatCurrency(invoice.totals.subTotal)}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">VAT</span>
                                    <span className="text-gray-900">{formatCurrency(invoice.totals.vat)}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">WHT</span>
                                    <span className="text-gray-900">{formatCurrency(invoice.totals.wht)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-900 font-medium">Total</span>
                                    <span className="text-gray-900 font-medium">{formatCurrency(invoice.totals.total)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-blue-50 px-4 rounded-lg mt-1">
                                    <span className="text-gray-900 font-medium">Balance Due</span>
                                    <span className="text-gray-900 font-medium">{formatCurrency(invoice.totals.balanceDue)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="mb-8 md:mb-12">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Signature</h3>
                            <div className="text-gray-600 italic">{invoice.signature}</div>
                        </div>

                        {/* Note */}
                        <div className="mb-6 md:mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                            <p className="text-gray-600 text-sm">{invoice.note}</p>
                        </div>

                        {/* Terms of Payment */}
                        <div className="mb-6 md:mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                            <p className="text-gray-600 text-sm">{invoice.termsOfPayment}</p>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-6 md:mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Method: {invoice.paymentMethod.method}</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Bank Name:</span>
                                    <span className="text-gray-900 font-medium text-sm">{invoice.paymentMethod.bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Account Number</span>
                                    <span className="text-gray-900 font-medium text-sm">{invoice.paymentMethod.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Account Name</span>
                                    <span className="text-gray-900 font-medium text-sm">{invoice.paymentMethod.accountName}</span>
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

export default InvoiceDetailPage;