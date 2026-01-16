"use client";

import { useState } from "react";
import { CustomerLayout } from "@/components/customerSection";
import { UploadReceiptModal } from "@/components/modals";

const CustomerFlowPage = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleUploadReceipt = (file: File) => {
        // Handle the uploaded file here
        console.log('Uploaded file:', file);
        // You can implement the actual upload logic here
        // For example, send to an API endpoint
        alert(`Receipt "${file.name}" uploaded successfully!`);
    };
    // Sample invoice data matching the image
    const invoice = {
        id: "1",
        title: "Sample Invoice",
        invoiceNumber: "INV-001",
        creationDate: "2024-01-15",
        dueDate: "2024-02-15",
        currency: "NGN",
        status: "UNPAID",
        subtotal: 50000,
        totalTaxAmount: 5000,
        totalDue: 55000,
        logoUrl: "",
        signatureUrl: "/assets/signature-sample.png", // You can add a signature image
        note: "Kindly make payments via Paystack or bank transfer using the account details provided. Thank you for choosing us.",
        termsAndConditions: "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
        paymentTerms: "Net 30",
        bank: "Zenith Bank Plc",
        accountNumber: "1234567890",
        accountName: "Original Invoice Demo Ltd",
        billFrom: {
            fullName: "Original Invoice",
            email: "info@originalinvoice.com",
            phone: "+234 123 456 7890",
            address: "Lagos, Nigeria"
        },
        billTo: {
            id: "1",
            customerType: "business",
            title: "Mr",
            fullName: "John Doe",
            businessName: "Demo Company Ltd",
            email: "john@democompany.com",
            phone: "+234 987 654 3210",
            country: "Nigeria"
        },
        items: [
            {
                id: "1",
                itemName: "Web Development Service",
                description: "Custom website development with responsive design",
                quantity: 1,
                rate: 50000,
                amount: 50000
            }
        ],
        appliedTaxes: [
            {
                taxId: "1",
                taxName: "VAT (10%)",
                taxType: "percentage",
                appliedRate: 10,
                taxableAmount: 50000,
                taxAmount: 5000
            }
        ]
    };

    const formatCurrency = (amount: number) => {
        return `${invoice.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID':
                return 'bg-[#ECFDF5] text-[#10B981] border-[#10B981]';
            case 'UNPAID':
                return 'bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]';
            case 'OVERDUE':
                return 'bg-[#FEF3C7] text-[#F59E0B] border-[#F59E0B]';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-300';
        }
    };

    return (
        <CustomerLayout>
            <div className="max-w-5xl mx-auto p-6">
                {/* Upload Receipt Button */}
                <div className="mb-6 flex justify-end">
                    <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Receipt
                    </button>
                </div>

                {/* Invoice Content - White background */}
                <div className="bg-white rounded-lg shadow-sm relative overflow-hidden">
                    {/* Watermark */}
                    {invoice.status === 'UNPAID' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div 
                                className="text-orange-100 font-bold select-none"
                                style={{
                                    fontSize: '120px',
                                    transform: 'rotate(-45deg)',
                                    opacity: 0.1,
                                    letterSpacing: '8px'
                                }}
                            >
                                UNPAID
                            </div>
                        </div>
                    )}
                    
                    <div className="px-12 py-4 relative z-20">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start mb-12">
                            <div className="flex items-center mt-8 justify-center">
                                {invoice.logoUrl ? (
                                    <img src={invoice.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-4xl font-medium text-black">Logo</span>
                                )}
                            </div>
                            <div className="text-right">
                                <h1 className="text-[28px] text-gray-900 mb-2">INVOICE</h1>
                                <p className="text-gray-600 mb-1">#{invoice.invoiceNumber}</p>
                                <div className="mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </div>
                                <p className="text-[14px] text-gray-500 mb-2">Balance Due</p>
                                <p className="text-[16px] font-semibold text-gray-900">{formatCurrency(invoice.totalDue)}</p>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="flex justify-between mb-8">
                            <div className="flex-1 text-right">
                                <div className="inline-block text-left space-y-2">
                                    <div className="flex justify-between gap-16">
                                        <span className="text-sm text-gray-600">Invoice Date</span>
                                        <span className="text-sm text-gray-900 font-medium">{formatDate(invoice.creationDate)}</span>
                                    </div>
                                    {invoice.paymentTerms && (
                                        <div className="flex justify-between gap-16">
                                            <span className="text-sm text-gray-600">Terms</span>
                                            <span className="text-sm text-gray-900 font-medium">{invoice.paymentTerms}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between gap-16">
                                        <span className="text-sm text-gray-600">Due Date</span>
                                        <span className="text-sm text-gray-900 font-medium">{formatDate(invoice.dueDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="mb-5">
                            <div className="flex justify-between">
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill From</h3>
                                    <p className="text-gray-900 font-medium">{invoice.billFrom.fullName}</p>
                                    <p className="text-gray-600 text-sm">{invoice.billFrom.address}</p>
                                    <p className="text-gray-600 text-sm">{invoice.billFrom.email}</p>
                                    {invoice.billFrom.phone && (
                                        <p className="text-gray-600 text-sm">{invoice.billFrom.phone}</p>
                                    )}
                                </div>
                                <div className="flex-1 text-right">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To</h3>
                                    <p className="text-gray-900 font-medium">{invoice.billTo.fullName}</p>
                                    <p className="text-gray-600 text-sm">{invoice.billTo.businessName}</p>
                                    <p className="text-gray-600 text-sm">{invoice.billTo.email}</p>
                                    {invoice.billTo.phone && (
                                        <p className="text-gray-600 text-sm">{invoice.billTo.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#F8F8FA]">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200 w-16">#</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200">Item Detail</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200 w-24">Qty</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200 w-32">Rate</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 border border-gray-200 w-32">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="py-4 px-4 text-gray-900 border border-gray-200">{index + 1}</td>
                                            <td className="py-4 px-4 text-gray-900 border border-gray-200">
                                                <div>
                                                    <p className="font-medium">{item.itemName}</p>
                                                    {item.description && (
                                                        <p className="text-sm text-gray-600">{item.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right text-gray-900 border border-gray-200">{item.quantity}</td>
                                            <td className="py-4 px-4 text-right text-gray-900 border border-gray-200">{item.rate.toLocaleString()}</td>
                                            <td className="py-4 px-4 text-right text-gray-900 font-medium border border-gray-200">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-12 text-[16px]">
                            <div className="w-80">
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Sub Total</span>
                                    <span className="text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                {invoice.appliedTaxes.map((tax) => (
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
                                    <span className="text-gray-900 font-medium">{formatCurrency(invoice.totalDue)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="mb-12">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Signature</h3>
                            <div className="text-gray-600 italic">—Charmaine</div>
                        </div>

                        {/* Note */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                            <p className="text-gray-600 text-sm">{invoice.note}</p>
                        </div>

                        {/* Terms of Payment */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                            <p className="text-gray-600 text-sm">{invoice.termsAndConditions}</p>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Method: Bank Transfer</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bank Name:</span>
                                    <span className="text-gray-900 font-medium">{invoice.bank}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account Number</span>
                                    <span className="text-gray-900 font-medium">{invoice.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account Name</span>
                                    <span className="text-gray-900 font-medium">{invoice.accountName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-6">
                            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors">
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

export default CustomerFlowPage;
