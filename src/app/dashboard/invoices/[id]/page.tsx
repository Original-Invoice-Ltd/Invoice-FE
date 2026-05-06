"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ApiClient } from "@/lib/api";
import { InvoiceResponse } from "@/types/invoice";
import { useTranslation } from "react-i18next";
import { UploadReceiptModal } from "@/components/modals";
import { formatCurrency as formatCurrencyUtil, CurrencyCode } from "@/lib/currencyFormatter";

const InvoiceViewPage = () => {
    const params = useParams();
    const router = useRouter();
    const { t } = useTranslation();
    const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
                setError(response.error || response.message || t('error_loading_invoices'));
            }
        } catch (err) {
            console.error("Error fetching invoice:", err);
            setError(t('unexpected_error'));
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
        return formatCurrencyUtil(amount || 0, { currency: currency as CurrencyCode });
    };

    const handleMarkAsPaid = async () => {
        const { toast } = await import("@/lib/toast");
        const response = await ApiClient.markInvoiceAsPaid(params.id as string);
        if (response.status === 200) {
            toast.show({ type: 'success', message: 'Successfully marked as paid' });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
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
                    <h2 className="text-xl font-semibold text-red-600 mb-2">{t('error')}</h2>
                    <p className="text-gray-600 mb-4">{error || t('invoice_not_found')}</p>
                    <Link
                        href="/dashboard/invoices"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        {t('back_to_invoices')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mb-[200px]">
            <div className="flex items-center justify-between mb-6 px-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/invoices"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-[#667085]" />
                    </Link>
                    <div>
                        <h1 className="text-[20px] font-semibold text-[#101828]">{t('invoice_details')}</h1>
                        <p className="text-[14px] text-[#667085]">
                            {t('invoice')} #{invoice.invoiceNumber}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                        >
                            Mark
                            <ChevronDown size={16} />
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            if (invoice.status !== 'PAID') {
                                                setIsDropdownOpen(false);
                                                handleMarkAsPaid();
                                            }
                                        }}
                                        disabled={invoice.status === 'PAID'}
                                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                                            invoice.status === 'PAID'
                                                ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                                        }`}
                                    >
                                        Mark as Paid
                    
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setIsUploadModalOpen(true);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Mark as Incomplete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-[#E4E7EC] overflow-hidden mx-6">
                <div className="relative">
                    <div className="relative z-0 p-4 sm:p-6 md:p-8 bg-white">
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                                    <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-[#101828] mb-3">Bill From</h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-[#101828]">{invoice.billFrom?.fullName}</p>
                                        {invoice.billFrom?.address && (
                                            <p className="text-sm text-[#667085]">{invoice.billFrom.address}</p>
                                        )}
                                        <p className="text-sm text-[#667085]">{invoice.billFrom?.email}</p>
                                        {invoice.billFrom?.phone && (
                                            <p className="text-sm text-[#667085]">{invoice.billFrom.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 md:text-right">
                                    <h3 className="text-sm font-semibold text-[#101828] mb-3">Bill To</h3>
                                    <div className="space-y-1">
                                        {invoice.billTo ? (
                                            <>
                                                <p className="text-sm font-medium text-[#101828]">
                                                    {invoice.billTo.businessName || invoice.billTo.fullName}
                                                </p>
                                                {invoice.billTo.country && (
                                                    <p className="text-sm text-[#667085]">{invoice.billTo.country}</p>
                                                )}
                                                <p className="text-sm text-[#667085]">{invoice.billTo.email}</p>
                                                {invoice.billTo.phone && (
                                                    <p className="text-sm text-[#667085]">{invoice.billTo.phone}</p>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-sm text-[#667085]">You (Received Invoice)</p>
                                        )}
                                    </div>
                                </div>
                            </div>

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
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#667085]">Terms</span>
                                        <span className="text-sm font-medium text-[#101828]">{invoice.paymentTerms || 'Net 60'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#667085]">Due Date</span>
                                        <span className="text-sm font-medium text-[#101828]">{formatDate(invoice.dueDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr style={{ backgroundColor: invoice.invoiceColor ? `${invoice.invoiceColor}20` : '#EBF5FF' }}>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD] w-12">#</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD]">Item Detail</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD] w-20">Qty</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD] w-32">Rate</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-[#101828] border border-[#D0D5DD] w-32">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.items?.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-3 px-4 text-sm text-[#101828] border border-[#D0D5DD]">{index + 1}</td>
                                            <td className="py-3 px-4 text-sm text-[#101828] border border-[#D0D5DD]">
                                                <div className="font-medium">{item.itemName}</div>
                                                {item.description && (
                                                    <div className="mt-1">
                                                        <div className="hidden md:block text-xs text-[#667085]">
                                                            {item.description}
                                                        </div>
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
                                                {formatCurrency(item.rate, invoice.currency)}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-[#101828] text-right border border-[#D0D5DD]">
                                                {formatCurrency(item.amount, invoice.currency)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mb-8">
                            <div className="w-full md:w-80">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#667085]">Sub Total</span>
                                        <span className="text-[#101828] font-medium">
                                            {formatCurrency(invoice.subtotal, invoice.currency)}
                                        </span>
                                    </div>
                                    {invoice.appliedTaxes && invoice.appliedTaxes.length > 0 ? (
                                        invoice.appliedTaxes.map((tax, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-[#667085]">
                                                    {tax.taxName} ({tax.appliedRate}%)
                                                </span>
                                                <span className="text-[#101828] font-medium">
                                                    {formatCurrency(tax.taxAmount, invoice.currency)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            {((invoice as any).vatRate > 0 || (invoice as any).vat > 0) && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[#667085]">VAT ({(invoice as any).vatRate || (invoice as any).vat}%)</span>
                                                    <span className="text-[#101828] font-medium">
                                                        +{formatCurrency(invoice.subtotal * (((invoice as any).vatRate || (invoice as any).vat) / 100), invoice.currency)}
                                                    </span>
                                                </div>
                                            )}
                                            {((invoice as any).whtRate > 0 || (invoice as any).wht > 0) && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-[#667085]">WHT ({(invoice as any).whtRate || (invoice as any).wht}%)</span>
                                                    <span className="text-[#101828] font-medium">
                                                        -{formatCurrency(invoice.subtotal * (((invoice as any).whtRate || (invoice as any).wht) / 100), invoice.currency)}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="flex justify-between text-sm pt-2 border-t border-[#E4E7EC]">
                                        <span className="text-[#101828] font-semibold">Total</span>
                                        <span className="text-[#101828] font-semibold">
                                            {formatCurrency(invoice.totalDue, invoice.currency)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 px-4 py-3 rounded" style={{ backgroundColor: invoice.invoiceColor ? `${invoice.invoiceColor}/20` : '#EBF5FF' }}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-[#101828]">Balance</span>
                                        <span className="text-base font-bold text-[#101828]">
                                            {formatCurrency(Number(invoice.outstandingBalance ?? 0), invoice.currency)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {invoice.signatureUrl && (
                            <div className="mb-8">
                                <div className="text-[14px] font-medium text-[#101828] mb-2">{t('signature_label')}</div>
                                <img 
                                    src={invoice.signatureUrl} 
                                    alt="Signature" 
                                    className="h-16 w-auto"
                                />
                            </div>
                        )}

                        {(invoice.note || invoice.termsAndConditions || invoice.paymentTerms) && (
                            <div className="space-y-6">
                                {invoice.note && (
                                    <div>
                                        <div className="text-[14px] font-medium text-[#101828] mb-2">{t('note_label')}</div>
                                        <div className="text-[14px] text-[#667085]">{invoice.note}</div>
                                    </div>
                                )}
                                
                                {invoice.termsAndConditions && (
                                    <div>
                                        <div className="text-[14px] font-medium text-[#101828] mb-2">{t('terms_of_payment_label')}</div>
                                        <div className="text-[14px] text-[#667085]">{invoice.termsAndConditions}</div>
                                    </div>
                                )}

                                {(invoice.accountNumber || invoice.accountName || invoice.bank) && (
                                    <div>
                                        <div className="text-[14px] font-medium text-[#101828] mb-2">{t('payment_method_bank_transfer')}</div>
                                        <div className="space-y-1 text-[14px] text-[#667085]">
                                            {invoice.bank && <div>{t('bank_name_label')} {invoice.bank}</div>}
                                            {invoice.accountNumber && <div>{t('account_number_label')} {invoice.accountNumber}</div>}
                                            {invoice.accountName && <div>{t('account_name_label')} {invoice.accountName}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

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

            <UploadReceiptModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                invoiceId={params.id as string}
                mode="incomplete"
                outstandingBalance={invoice?.outstandingBalance}
                invoiceTotalDue={invoice?.totalDue}
                invoiceCurrency={invoice?.currency}
                isDashboardUser={true}
            />

            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </div>
    );
};

export default InvoiceViewPage;