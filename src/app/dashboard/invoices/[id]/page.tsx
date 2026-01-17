"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Send, Edit, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ApiClient } from "@/lib/api";
import { InvoiceResponse } from "@/types/invoice";

const InvoiceViewPage = () => {
    const params = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchInvoice(params.id as string);
        }
    }, [params.id]);

    const fetchInvoice = async (invoiceId: string) => {
        try {
            setLoading(true);
            const response = await ApiClient.getInvoiceById(invoiceId);
            
            console.log('Invoice API Response:', response);
            
            if (response.status === 200 && response.data) {
                setInvoice(response.data);
            } else {
                setError(response.error || response.message || "Failed to fetch invoice");
            }
        } catch (err) {
            console.error("Error fetching invoice:", err);
            setError("An error occurred while fetching the invoice");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number | null | undefined, currency: string = 'NGN') => {
        const safeAmount = amount || 0;
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency || 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(safeAmount);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto mb-[200px] p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="max-w-7xl mx-auto mb-[200px] p-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error || "Invoice not found"}</p>
                    <Link
                        href="/dashboard/invoices"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Invoices
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mb-[200px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/invoices"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-[#667085]" />
                    </Link>
                    <div>
                        <h1 className="text-[20px] font-semibold text-[#101828]">Invoice Details</h1>
                        <p className="text-[14px] text-[#667085]">
                            Invoice #{invoice.invoiceNumber}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                        <Send size={16} />
                        Send Invoice
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors">
                        <Download size={16} />
                        Mark as Paid
                    </button>
                </div>
            </div>

            {/* Invoice Preview */}
            <div className="bg-white rounded-lg border border-[#E4E7EC] overflow-hidden mx-6">
                {/* Watermark overlay */}
                <div className="relative">
                    {/* Status-based watermark */}
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                        {invoice.status === 'PAID' && (
                            <>
                                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="text-[80px] font-bold text-green-200 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        PAID
                                    </div>
                                </div>
                                <div className="absolute top-2/3 right-1/4 transform translate-x-1/2 translate-y-1/2">
                                    <div className="text-[80px] font-bold text-green-200 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        PAID
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="text-[80px] font-bold text-green-200 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        PAID
                                    </div>
                                </div>
                            </>
                        )}
                        {invoice.status === 'OVERDUE' && (
                            <>
                                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="text-[80px] font-bold text-red-200 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        OVERDUE
                                    </div>
                                </div>
                                <div className="absolute top-2/3 right-1/4 transform translate-x-1/2 translate-y-1/2">
                                    <div className="text-[80px] font-bold text-red-200 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        OVERDUE
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="text-[80px] font-bold text-red-200 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        OVERDUE
                                    </div>
                                </div>
                            </>
                        )}
                        {invoice.status === 'UNPAID' && (
                            <>
                                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="text-[80px] font-bold text-orange-200 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        UNPAID
                                    </div>
                                </div>
                                <div className="absolute top-2/3 right-1/4 transform translate-x-1/2 translate-y-1/2">
                                    <div className="text-[80px] font-bold text-orange-200 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        UNPAID
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="text-[80px] font-bold text-orange-200 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        UNPAID
                                    </div>
                                </div>
                            </>
                        )}
                        {(!invoice.status || (invoice.status !== 'PAID' && invoice.status !== 'OVERDUE' && invoice.status !== 'UNPAID')) && (
                            <>
                                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="text-[80px] font-bold text-gray-300 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        ORIGINAL INVOICE
                                    </div>
                                </div>
                                <div className="absolute top-2/3 right-1/4 transform translate-x-1/2 translate-y-1/2">
                                    <div className="text-[80px] font-bold text-gray-300 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        ORIGINAL INVOICE
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="text-[80px] font-bold text-gray-300 opacity-15 rotate-[-30deg] select-none whitespace-nowrap">
                                        ORIGINAL INVOICE
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Invoice Content */}
                    <div className="relative z-0 p-8 bg-white">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                {invoice.logoUrl ? (
                                    <img 
                                        src={invoice.logoUrl} 
                                        alt="Company Logo" 
                                        className="h-16 w-auto object-contain"
                                    />
                                ) : (
                                    <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                                        Logo
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-[14px] text-[#667085] mb-1">Bill From</div>
                                <div className="text-[16px] font-semibold text-[#101828]">{invoice.billFrom?.fullName}</div>
                                <div className="text-[14px] text-[#667085]">{invoice.billFrom?.email}</div>
                                <div className="text-[14px] text-[#667085]">{invoice.billFrom?.phone}</div>
                                {invoice.billFrom?.address && (
                                    <div className="text-[14px] text-[#667085]">{invoice.billFrom.address}</div>
                                )}
                            </div>
                        </div>

                        {/* Invoice Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-[32px] font-bold text-[#101828]">Invoice</h1>
                        </div>

                        {/* Bill To and Invoice Details */}
                        <div className="flex justify-between mb-8">
                            <div>
                                <div className="text-[14px] text-[#667085] mb-2">Bill To</div>
                                <div className="text-[16px] font-semibold text-[#101828] mb-1">
                                    {invoice.billTo?.businessName || invoice.billTo?.fullName}
                                </div>
                                <div className="text-[14px] text-[#667085]">{invoice.billTo?.email}</div>
                                <div className="text-[14px] text-[#667085]">{invoice.billTo?.phone}</div>
                                {invoice.billTo?.country && (
                                    <div className="text-[14px] text-[#667085]">{invoice.billTo.country}</div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-[14px] text-[#667085] mb-1">Invoice ID</div>
                                <div className="text-[16px] font-semibold text-[#101828] mb-4">{invoice.invoiceNumber}</div>
                                <div className="text-[14px] text-[#667085] mb-1">Invoice Date</div>
                                <div className="text-[14px] text-[#101828] mb-2">{formatDate(invoice.creationDate)}</div>
                                <div className="text-[14px] text-[#667085] mb-1">Due Date</div>
                                <div className="text-[14px] text-[#101828]">{formatDate(invoice.dueDate)}</div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-8">
                            <div className="bg-[#2F80ED] text-white px-6 py-3 rounded-t-lg">
                                <div className="grid grid-cols-5 gap-4 text-[14px] font-medium">
                                    <div className="col-span-2">Item Description</div>
                                    <div className="text-center">Qty</div>
                                    <div className="text-center">Rate</div>
                                    <div className="text-right">Amount</div>
                                </div>
                            </div>
                            <div className="border border-t-0 border-[#E4E7EC] rounded-b-lg">
                                {invoice.items?.map((item, index) => (
                                    <div key={index} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-[#E4E7EC] last:border-b-0">
                                        <div className="col-span-2">
                                            <div className="text-[14px] font-medium text-[#101828]">{item.itemName}</div>
                                            {item.description && (
                                                <div className="text-[12px] text-[#667085] mt-1">{item.description}</div>
                                            )}
                                        </div>
                                        <div className="text-center text-[14px] text-[#101828]">{item.quantity}</div>
                                        <div className="text-center text-[14px] text-[#101828]">
                                            {formatCurrency(item.rate, invoice.currency)}
                                        </div>
                                        <div className="text-right text-[14px] font-medium text-[#101828]">
                                            {formatCurrency(item.amount, invoice.currency)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end mb-8">
                            <div className="w-80">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[#667085]">Sub Total</span>
                                        <span className="text-[#101828] font-medium">
                                            {formatCurrency(invoice.subtotal, invoice.currency)}
                                        </span>
                                    </div>
                                    {invoice.appliedTaxes?.map((tax, index) => (
                                        <div key={index} className="flex justify-between text-[14px]">
                                            <span className="text-[#667085]">
                                                {tax.taxName} ({tax.appliedRate}%)
                                            </span>
                                            <span className="text-[#101828] font-medium">
                                                {formatCurrency(tax.taxAmount, invoice.currency)}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="border-t border-[#E4E7EC] pt-2">
                                        <div className="flex justify-between text-[16px] font-semibold">
                                            <span className="text-[#101828]">Total</span>
                                            <span className="text-[#101828]">
                                                {formatCurrency(invoice.totalDue, invoice.currency)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 bg-[#2F80ED] text-white px-4 py-2 rounded text-center">
                                    <div className="text-[14px] font-medium">Amount Due</div>
                                    <div className="text-[18px] font-bold">
                                        {formatCurrency(invoice.totalDue, invoice.currency)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature */}
                        {invoice.signatureUrl && (
                            <div className="mb-8">
                                <div className="text-[14px] font-medium text-[#101828] mb-2">Signature</div>
                                <img 
                                    src={invoice.signatureUrl} 
                                    alt="Signature" 
                                    className="h-16 w-auto"
                                />
                            </div>
                        )}

                        {/* Notes and Terms */}
                        {(invoice.note || invoice.termsAndConditions || invoice.paymentTerms) && (
                            <div className="space-y-6">
                                {invoice.note && (
                                    <div>
                                        <div className="text-[14px] font-medium text-[#101828] mb-2">Note</div>
                                        <div className="text-[14px] text-[#667085]">{invoice.note}</div>
                                    </div>
                                )}
                                
                                {invoice.termsAndConditions && (
                                    <div>
                                        <div className="text-[14px] font-medium text-[#101828] mb-2">Terms of Payment</div>
                                        <div className="text-[14px] text-[#667085]">{invoice.termsAndConditions}</div>
                                    </div>
                                )}

                                {(invoice.accountNumber || invoice.accountName || invoice.bank) && (
                                    <div>
                                        <div className="text-[14px] font-medium text-[#101828] mb-2">Payment Method Bank Transfer</div>
                                        <div className="space-y-1 text-[14px] text-[#667085]">
                                            {invoice.bank && <div>Bank Name: {invoice.bank}</div>}
                                            {invoice.accountNumber && <div>Account Number: {invoice.accountNumber}</div>}
                                            {invoice.accountName && <div>Account Name: {invoice.accountName}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6 px-6">
                <button className="flex items-center gap-2 px-6 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                    <Download size={16} />
                    Save as PDF
                </button>
                <Link
                    href={`/dashboard/invoices/edit/${invoice.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                >
                    <Edit size={16} />
                    Edit Invoice
                </Link>
            </div>
        </div>
    );
};

export default InvoiceViewPage;