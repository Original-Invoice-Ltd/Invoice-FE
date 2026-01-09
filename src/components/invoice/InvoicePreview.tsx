"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Mail, X } from "lucide-react";
import { InvoiceItem } from "@/lib/invoiceTypes";

interface InvoiceData {
    logo: string | null;
    billFrom: {
        fullName: string;
        email: string;
        address: string;
        phoneNumber: string;
        businessName: string;
    };
    billTo: {
        customer: string;
        title: string;
        invoiceNumber: string;
        paymentTerms: string;
        invoiceDate: string;
        dueDate: string;
    };
    items: InvoiceItem[];
    customerNote: string;
    termsAndConditions: string;
    signature: string | null;
    currency: string;
    language: string;
    color: string;
    template: string;
    paymentDetails: {
        bankAccount: string;
        accountName: string;
        accountNumber: string;
    };
    vat: number;
    wht: number;
    selectedClientId: string;
    invoiceTaxRate?: number;
}
import { InvoiceResponse } from "@/types/invoice";

interface InvoicePreviewProps {
    data: InvoiceData;
    onEdit: () => void;
    onEmailInvoice: () => void;
    onSendInvoice: () => Promise<{ success: boolean; error?: string }>;
}

const InvoicePreview = ({ data, onEdit, onEmailInvoice, onSendInvoice }: InvoicePreviewProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showSendDropdown, setShowSendDropdown] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [showTelegramModal, setShowTelegramModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [emailTo, setEmailTo] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");
    const sendDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sendDropdownRef.current && !sendDropdownRef.current.contains(event.target as Node)) {
                setShowSendDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendInvoice = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        
        try {
            const result = await onSendInvoice();
            if (result.success) {
                setSubmitSuccess(true);
                setShowEmailModal(false);
                setShowWhatsAppModal(false);
                setShowTelegramModal(false);
                setShowSuccessModal(true);
            } else {
                setSubmitError(result.error || 'Failed to send invoice');
            }
        } catch (error) {
            setSubmitError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailOptionClick = () => {
        setShowSendDropdown(false);
        setEmailTo(data.billFrom.email || "");
        setShowEmailModal(true);
    };

    const handleWhatsAppOptionClick = () => {
        setShowSendDropdown(false);
        setPhoneNumber("");
        setMessage("");
        setShowWhatsAppModal(true);
    };

    const handleTelegramOptionClick = () => {
        setShowSendDropdown(false);
        setPhoneNumber("");
        setMessage("");
        setShowTelegramModal(true);
    };

    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + item.amount, 0);
    };

    const calculateVAT = () => {
        const subtotal = calculateSubtotal();
        return subtotal * ((data.invoiceTaxRate || 0) / 100);
    };

    const calculateWHT = () => {
        return calculateSubtotal() * (data.wht / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateVAT() + calculateWHT();
    };

    const formatCurrency = (amount: number) => {
        return `${data.currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    invoice: InvoiceResponse;
    showWatermark?: boolean;
    className?: string;
}

const InvoicePreview = ({ invoice, showWatermark = false, className = "" }: InvoicePreviewProps) => {
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
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(safeAmount);
    };

    return (
        <div className={`bg-white shadow-lg ${className}`}>
            {/* Watermark Background */}
            {showWatermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="text-gray-200 text-6xl font-bold transform -rotate-45 select-none">
                        ORIGINAL INVOICE
                    </div>
                </div>
            )}

            {/* Invoice Content */}
            <div className="p-8 relative z-20">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div className="flex-1">
                        {invoice?.logoUrl ? (
                            <img 
                                src={invoice.logoUrl} 
                                alt="Company Logo" 
                                className="h-16 w-auto mb-4"
                            />
                        ) : (
                            <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center mb-4">
                                <span className="text-gray-500 text-sm">Logo</span>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                        <div className="text-sm text-gray-600">{invoice?.invoiceNumber || 'N/A'}</div>
                    </div>
                </div>

                {/* Bill From and Bill To Section */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">BILL FROM</h3>
                        <div className="text-sm text-gray-700">
                            <div className="font-medium">{invoice?.billFrom?.fullName || 'N/A'}</div>
                            <div>{invoice?.billFrom?.email || 'N/A'}</div>
                            <div>{invoice?.billFrom?.phone || 'N/A'}</div>
                            {invoice?.billFrom?.address && <div>{invoice.billFrom.address}</div>}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">BILL TO</h3>
                        <div className="text-sm text-gray-700">
                            <div className="font-medium">{invoice?.billTo?.businessName || invoice?.billTo?.fullName || 'N/A'}</div>
                            <div>{invoice?.billTo?.email || 'N/A'}</div>
                            <div>{invoice?.billTo?.phone || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-4 gap-4 mb-8 text-sm">
                    <div>
                        <div className="text-gray-600 mb-1">Invoice Date</div>
                        <div className="font-medium">{invoice?.creationDate ? formatDate(invoice.creationDate) : 'N/A'}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Payment Terms</div>
                        <div className="font-medium">{invoice?.paymentTerms || 'Net 30'}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Due Date</div>
                        <div className="font-medium">{invoice?.dueDate ? formatDate(invoice.dueDate) : 'N/A'}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 mb-1">Amount</div>
                        <div className="font-medium">{formatCurrency(invoice?.totalDue, invoice?.currency)}</div>
                    </div>
                </div>

                {/* Items Table */}
                {invoice?.items && invoice.items.length > 0 && (
                    <div className="mb-8">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="text-left py-2 text-sm font-semibold text-gray-900">#</th>
                                    <th className="text-left py-2 text-sm font-semibold text-gray-900">Item Description</th>
                                    <th className="text-right py-2 text-sm font-semibold text-gray-900">Qty</th>
                                    <th className="text-right py-2 text-sm font-semibold text-gray-900">Rate</th>
                                    <th className="text-right py-2 text-sm font-semibold text-gray-900">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={item.id || index} className="border-b border-gray-200">
                                        <td className="py-3 text-sm text-gray-700">{index + 1}</td>
                                        <td className="py-3 text-sm text-gray-700">
                                            <div className="font-medium">{item.itemName}</div>
                                            {item.description && (
                                                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                                            )}
                                        </td>
                                        <td className="py-3 text-sm text-gray-700 text-right">{item.quantity || 0}</td>
                                        <td className="py-3 text-sm text-gray-700 text-right">{formatCurrency(item.rate, invoice?.currency)}</td>
                                        <td className="py-3 text-sm text-gray-700 text-right font-medium">{formatCurrency(item.amount, invoice?.currency)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Totals Section */}
                <div className="flex justify-end mb-8">
                    <div className="w-80">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sub Total</span>
                                <span className="font-medium">{formatCurrency(invoice?.subtotal, invoice?.currency)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Tax ({data.invoiceTaxRate || 0}%)</span>
                                <span className="text-gray-900 ">{formatCurrency(calculateVAT())}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">WHT ({data.wht}%)</span>
                                <span className="text-gray-900 ">{formatCurrency(calculateWHT())}</span>
                            </div>
                            <div className="flex justify-between py-2 ">
                                <span className="text-gray-900 font-medium">Total</span>
                                <span className="text-gray-900 font-medium">{formatCurrency(calculateTotal())}</span>
                            </div>
                            <div className="flex justify-between py-2 bg-blue-50 px-4 rounded-lg mt-1">
                                <span className="text-gray-900 font-medium">Balance Due</span>
                                <span className="text-gray-900 font-medium">{formatCurrency(calculateTotal())}</span>
                            </div>
                        </div>
                    </div>
                            {invoice?.appliedTaxes && invoice.appliedTaxes.map((tax, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="text-gray-600">{tax.taxName} ({tax.appliedRate}%)</span>
                                    <span className="font-medium">{formatCurrency(tax.taxAmount, invoice?.currency)}</span>
                                </div>
                            ))}
                            <div className="border-t border-gray-300 pt-2">
                                <div className="flex justify-between font-semibold text-base">
                                    <span>Total</span>
                                    <span>{formatCurrency(invoice?.totalDue, invoice?.currency)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 bg-blue-600 text-white p-3 rounded text-center">
                            <div className="text-sm font-medium">Amount Due</div>
                            <div className="text-lg font-bold">{formatCurrency(invoice?.totalDue, invoice?.currency)}</div>
                        </div>
                    </div>
                </div>

                {/* Optional Sections - Only show if they exist */}
                <div className="space-y-6">
                    {/* Signature */}
                    {invoice?.signatureUrl && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Signature</h3>
                            <img 
                                src={invoice.signatureUrl} 
                                alt="Signature" 
                                className="h-16 w-auto border border-gray-200 p-2"
                            />
                        </div>
                    )}

                    {/* Note */}
                    {invoice?.note && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{invoice.note}</p>
                        </div>
                    )}

                    {/* Terms and Conditions */}
                    {invoice?.termsAndConditions && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{invoice.termsAndConditions}</p>
                        </div>
                    )}

                    {/* Payment Method */}
                    {(invoice?.bank || invoice?.accountNumber || invoice?.accountName) && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Method (Bank Transfer)</h3>
                            <div className="text-sm text-gray-700 space-y-1">
                                {invoice?.bank && (
                                    <div><span className="font-medium">Bank Name:</span> {invoice.bank}</div>
                                )}
                                {invoice?.accountNumber && (
                                    <div><span className="font-medium">Account Number:</span> {invoice.accountNumber}</div>
                                )}
                                {invoice?.accountName && (
                                    <div><span className="font-medium">Account Name:</span> {invoice.accountName}</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;