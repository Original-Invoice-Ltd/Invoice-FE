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

    return (
        <div className="bg-white p-8">
            {/* Invoice Preview Content */}
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        {data.logo && (
                            <img src={data.logo} alt="Logo" className="h-16 w-auto" />
                        )}
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-bold">INVOICE</h1>
                        <p className="text-gray-600">{data.billTo.invoiceNumber}</p>
                    </div>
                </div>

                {/* Bill From/To */}
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold mb-2">BILL FROM</h3>
                        <div className="text-sm text-gray-700">
                            <p>{data.billFrom.fullName}</p>
                            <p>{data.billFrom.email}</p>
                            <p>{data.billFrom.phoneNumber}</p>
                            <p>{data.billFrom.address}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">BILL TO</h3>
                        <div className="text-sm text-gray-700">
                            <p>{data.billTo.customer}</p>
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Invoice Date</p>
                        <p className="font-medium">{data.billTo.invoiceDate}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-medium">{data.billTo.dueDate}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Payment Terms</p>
                        <p className="font-medium">{data.billTo.paymentTerms}</p>
                    </div>
                </div>

                {/* Items Table */}
                {data.items.length > 0 && (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Item</th>
                                <th className="text-right py-2">Qty</th>
                                <th className="text-right py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="py-2">{item.itemName}</td>
                                    <td className="text-right">{item.quantity}</td>
                                    <td className="text-right">{formatCurrency(item.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>VAT ({data.invoiceTaxRate || 0}%)</span>
                            <span>{formatCurrency(calculateVAT())}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>WHT ({data.wht}%)</span>
                            <span>{formatCurrency(calculateWHT())}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                            <span>Total</span>
                            <span>{formatCurrency(calculateTotal())}</span>
                        </div>
                    </div>
                </div>

                {/* Notes and Terms */}
                {data.customerNote && (
                    <div>
                        <h3 className="font-semibold mb-2">Note</h3>
                        <p className="text-sm text-gray-700">{data.customerNote}</p>
                    </div>
                )}

                {data.termsAndConditions && (
                    <div>
                        <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                        <p className="text-sm text-gray-700">{data.termsAndConditions}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoicePreview;
