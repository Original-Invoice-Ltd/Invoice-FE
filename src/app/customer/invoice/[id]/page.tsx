"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CustomerHeader from "@/components/customer/header";
import CustomerSidebar from "@/components/customer/sideBar";
import { ApiClient } from "@/lib/api";

interface InvoiceItem {
    id: string;
    itemName: string;
    description?: string;
    quantity: number;
    rate: number;
    amount: number;
}

interface InvoiceData {
    id: string;
    title: string;
    invoiceNumber: string;
    creationDate: string;
    dueDate: string;
    currency: string;
    invoiceColor: string;
    status: string;
    subtotal: number;
    totalTaxAmount: number;
    totalDue: number;
    logoUrl?: string;
    signatureUrl?: string;
    note?: string;
    termsAndConditions?: string;
    paymentTerms?: string;
    bank?: string;
    accountNumber?: string;
    accountName?: string;
    billFrom: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
    };
    billTo: {
        id: string;
        customerType: string;
        title: string;
        fullName: string;
        businessName: string;
        email: string;
        phone: string;
        country: string;
    };
    items: InvoiceItem[];
    appliedTaxes: Array<{
        taxId: string;
        taxName: string;
        taxType: string;
        appliedRate: number;
        taxableAmount: number;
        taxAmount: number;
    }>;
}

const CustomerInvoicePage = () => {
    const params = useParams();
    const invoiceId = params.id as string;
    const [invoice, setInvoice] = useState<InvoiceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                setIsLoading(true);
                const response = await ApiClient.getInvoiceById(invoiceId);
                
                if (response.status === 200) {
                    setInvoice(response.data);
                } else {
                    setError('Invoice not found');
                }
            } catch (error) {
                console.error('Error fetching invoice:', error);
                setError('Failed to load invoice');
            } finally {
                setIsLoading(false);
            }
        };

        if (invoiceId) {
            fetchInvoice();
        }
    }, [invoiceId]);

    const formatCurrency = (amount: number) => {
        return `${invoice?.currency || 'NGN'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <CustomerHeader />
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen bg-gray-50">
                <CustomerHeader />
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-[#101828] mb-2">Invoice Not Found</h2>
                        <p className="text-[#667085]">{error || 'The invoice you are looking for does not exist.'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <CustomerHeader />
            
            <div className="flex">
                {/* Main Content */}
                <div className="flex-1">
                    <div className="max-w-5xl mx-auto p-6">
                        {/* Invoice Content - White background */}
                        <div className="bg-white rounded-lg shadow-sm relative overflow-hidden">
                            {/* Watermark */}
                            {invoice.status === 'PAID' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <div 
                                        className="text-green-100 font-bold select-none"
                                        style={{
                                            fontSize: '120px',
                                            transform: 'rotate(-45deg)',
                                            opacity: 0.1,
                                            letterSpacing: '8px'
                                        }}
                                    >
                                        PAID
                                    </div>
                                </div>
                            )}
                            {invoice.status === 'OVERDUE' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <div 
                                        className="text-red-100 font-bold select-none"
                                        style={{
                                            fontSize: '120px',
                                            transform: 'rotate(-45deg)',
                                            opacity: 0.1,
                                            letterSpacing: '8px'
                                        }}
                                    >
                                        OVERDUE
                                    </div>
                                </div>
                            )}
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
                                    <p className="text-gray-600 text-sm">{invoice.billFrom.address || 'Nigeria'}</p>
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
                        {invoice.signatureUrl && (
                            <div className="mb-12">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Signature</h3>
                                <img src={invoice.signatureUrl} alt="Signature" className="h-16" />
                            </div>
                        )}

                        {/* Note */}
                        {invoice.note && (
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                                <p className="text-gray-600 text-sm">{invoice.note}</p>
                            </div>
                        )}

                        {/* Terms of Payment */}
                        {invoice.termsAndConditions && (
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                                <p className="text-gray-600 text-sm">{invoice.termsAndConditions}</p>
                            </div>
                        )}

                        {/* Payment Method */}
                        {invoice.bank && invoice.accountNumber && invoice.accountName && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method: Bank Transfer</h3>
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
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 pt-6">
                            <button className="px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors">
                                Download PDF
                            </button>
                            <button className="px-6 py-3 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-blue-50 transition-colors">
                                Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar */}
        <CustomerSidebar 
            invoiceStatus={invoice.status}
            totalDue={invoice.totalDue}
            currency={invoice.currency}
        />
    </div>
</div>
);
};

export default CustomerInvoicePage;