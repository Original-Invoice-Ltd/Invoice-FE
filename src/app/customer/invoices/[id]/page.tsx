"use client";

import { CustomerLayout } from "@/components/customerSection";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadReceiptModal } from "@/components/modals";
import { getInvoiceById } from "@/lib/mockData";

interface InvoiceDetailPageProps {
    params: {
        id: string;
    };
}

const InvoiceDetailPage = ({ params }: InvoiceDetailPageProps) => {
    const router = useRouter();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleUploadReceipt = (file: File) => {
        console.log('Uploaded file:', file);
        alert(`Receipt "${file.name}" uploaded successfully!`);
    };

    // Get invoice data based on ID
    const invoice = getInvoiceById(parseInt(params.id));

    // If invoice not found, show error
    if (!invoice) {
        return (
            <CustomerLayout>
                <div className="flex-1 p-6">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Invoice Not Found</h1>
                        <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist.</p>
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
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none"><path stroke="#2F80ED" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 24h16m-16 0 6 6m-6-6 6-6"/></svg>
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      
        
                        
                        {/* Upload Receipt Button */}
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            
                            Upload Receipt
                        </button>
                       
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    {/* Invoice Header */}
                     <div className="mb-2 flex justify-end">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(invoice.status)}`}>
                                    {invoice.status}
                                </span>
                            </div>
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-medium text-gray-900 mb-8">Logo</h2>
                        </div>
                        
                        <div className="text-right">
                            {/* Status Badge */}
                           
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Bill From</p>
                                <p className="font-medium text-gray-900">{invoice.billFrom.company}</p>
                                <p className="text-sm text-gray-600">{invoice.billFrom.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Title and Details */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Invoice</h1>
                    </div>

                    {/* Bill To and Invoice Info */}
                    <div className="flex justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To</h3>
                            <p className="font-medium text-gray-900">{invoice.billTo.name}</p>
                            <p className="text-sm text-gray-600">{invoice.billTo.location}</p>
                            <p className="text-sm text-gray-600">{invoice.billTo.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">{invoice.invoiceId}</p>
                            <p className="text-sm text-gray-600 mb-1">Balance Due</p>
                            <p className="text-lg font-bold text-gray-900">₦{invoice.totals.balanceDue.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Invoice Dates Table */}
                    <div className="mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="px-4 py-3 text-left text-sm font-medium">Invoice Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Payment Terms</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="px-4 py-3 text-sm text-gray-900">{invoice.dates.invoiceDate}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{invoice.dates.paymentTerms}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{invoice.dates.dueDate}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-600">Item Detail</th>
                                    <th className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-600">Qty</th>
                                    <th className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-600">Rate</th>
                                    <th className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-600">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                                        <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{item.description}</td>
                                        <td className="border border-gray-200 px-4 py-3 text-right text-sm text-gray-900">{item.qty.toLocaleString()}</td>
                                        <td className="border border-gray-200 px-4 py-3 text-right text-sm text-gray-900">{item.rate.toLocaleString()}</td>
                                        <td className="border border-gray-200 px-4 py-3 text-right text-sm font-medium text-gray-900">₦{item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-8">
                        <div className="w-80">
                            <div className="space-y-2">
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">Sub Total</span>
                                    <span className="text-sm text-gray-900">{invoice.totals.subTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">VAT (7.5%)</span>
                                    <span className="text-sm text-gray-900">{invoice.totals.vat.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-sm text-gray-600">WHT (1%)</span>
                                    <span className="text-sm text-gray-900">{invoice.totals.wht.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-t border-gray-200">
                                    <span className="text-sm font-medium text-gray-900">Total</span>
                                    <span className="text-sm font-medium text-gray-900">₦{invoice.totals.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-blue-600 text-white px-4 rounded">
                                    <span className="text-sm font-medium">Balance Due</span>
                                    <span className="text-sm font-medium">₦{invoice.totals.balanceDue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Signature</h3>
                        <p className="text-gray-600 italic">{invoice.signature}</p>
                    </div>

                    {/* Note */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                        <p className="text-sm text-gray-600">{invoice.note}</p>
                    </div>

                    {/* Terms of Payment */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                        <p className="text-sm text-gray-600">{invoice.termsOfPayment}</p>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Method: {invoice.paymentMethod.method}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Bank Name:</span>
                                <span className="text-sm font-medium text-gray-900">{invoice.paymentMethod.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Account Number:</span>
                                <span className="text-sm font-medium text-gray-900">{invoice.paymentMethod.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Account Name:</span>
                                <span className="text-sm font-medium text-gray-900">{invoice.paymentMethod.accountName}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Share
                        </button>
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