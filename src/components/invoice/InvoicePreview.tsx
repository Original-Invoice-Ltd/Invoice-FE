"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Mail, X } from "lucide-react";

interface InvoiceItem {
    id: number;
    itemName: string;
    quantity: number;
    rate: number;
    tax: number;
    amount: number;
}

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
        return calculateSubtotal() * (data.vat / 100);
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="max-w-5xl mx-auto">
                {/* Header Actions - Outside white background */}
                <div className="flex justify-end gap-3 mb-6">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-6 py-2.5 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-blue-50 transition-colors bg-white"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.2055 19.5733C9.86497 19.9139 9.42656 20.1395 8.95154 20.2186L4.34563 20.9863C3.56372 21.1166 2.88583 20.4387 3.01615 19.6568L3.7838 15.0509C3.86297 14.5759 4.08859 14.1375 4.42911 13.797M10.2055 19.5733L18.7258 11.053L12.9494 5.27665M10.2055 19.5733L4.42911 13.797M4.42911 13.797L12.9494 5.27665M12.9494 5.27665L14.6119 3.61413C15.4308 2.79529 16.7584 2.79529 17.5772 3.61413L20.3859 6.42279C21.2057 7.24258 21.2046 8.57207 20.3834 9.39051L18.7258 11.0427M21 20.9863H15" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Edit
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-blue-50 transition-colors bg-white">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 14.25C21 14.4489 20.921 14.6397 20.7803 14.7803C20.6397 14.921 20.4489 15 20.25 15H18V16.5H19.5C19.6989 16.5 19.8897 16.579 20.0303 16.7197C20.171 16.8603 20.25 17.0511 20.25 17.25C20.25 17.4489 20.171 17.6397 20.0303 17.7803C19.8897 17.921 19.6989 18 19.5 18H18V19.5C18 19.6989 17.921 19.8897 17.7803 20.0303C17.6397 20.171 17.4489 20.25 17.25 20.25C17.0511 20.25 16.8603 20.171 16.7197 20.0303C16.579 19.8897 16.5 19.6989 16.5 19.5V14.25C16.5 14.0511 16.579 13.8603 16.7197 13.7197C16.8603 13.579 17.0511 13.5 17.25 13.5H20.25C20.4489 13.5 20.6397 13.579 20.7803 13.7197C20.921 13.8603 21 14.0511 21 14.25ZM8.625 16.125C8.625 16.8212 8.34844 17.4889 7.85616 17.9812C7.36387 18.4734 6.69619 18.75 6 18.75H5.25V19.5C5.25 19.6989 5.17098 19.8897 5.03033 20.0303C4.88968 20.171 4.69891 20.25 4.5 20.25C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V14.25C3.75 14.0511 3.82902 13.8603 3.96967 13.7197C4.11032 13.579 4.30109 13.5 4.5 13.5H6C6.69619 13.5 7.36387 13.7766 7.85616 14.2688C8.34844 14.7611 8.625 15.4288 8.625 16.125ZM7.125 16.125C7.125 15.8266 7.00647 15.5405 6.7955 15.3295C6.58452 15.1185 6.29837 15 6 15H5.25V17.25H6C6.29837 17.25 6.58452 17.1315 6.7955 16.9205C7.00647 16.7095 7.125 16.4234 7.125 16.125ZM15.375 16.875C15.375 17.7701 15.0194 18.6285 14.3865 19.2615C13.7535 19.8944 12.8951 20.25 12 20.25H10.5C10.3011 20.25 10.1103 20.171 9.96967 20.0303C9.82902 19.8897 9.75 19.6989 9.75 19.5V14.25C9.75 14.0511 9.82902 13.8603 9.96967 13.7197C10.1103 13.579 10.3011 13.5 10.5 13.5H12C12.8951 13.5 13.7535 13.8556 14.3865 14.4885C15.0194 15.1215 15.375 15.9799 15.375 16.875ZM13.875 16.875C13.875 16.3777 13.6775 15.9008 13.3258 15.5492C12.9742 15.1975 12.4973 15 12 15H11.25V18.75H12C12.4973 18.75 12.9742 18.5525 13.3258 18.2008C13.6775 17.8492 13.875 17.3723 13.875 16.875ZM3.75 10.5V3.75C3.75 3.35218 3.90804 2.97064 4.18934 2.68934C4.47064 2.40804 4.85218 2.25 5.25 2.25H14.25C14.3485 2.24992 14.4461 2.26926 14.5371 2.3069C14.6282 2.34454 14.7109 2.39975 14.7806 2.46938L20.0306 7.71938C20.1003 7.78908 20.1555 7.87182 20.1931 7.96286C20.2307 8.05391 20.2501 8.15148 20.25 8.25V10.5C20.25 10.6989 20.171 10.8897 20.0303 11.0303C19.8897 11.171 19.6989 11.25 19.5 11.25C19.3011 11.25 19.1103 11.171 18.9697 11.0303C18.829 10.8897 18.75 10.6989 18.75 10.5V9H14.25C14.0511 9 13.8603 8.92098 13.7197 8.78033C13.579 8.63968 13.5 8.44891 13.5 8.25V3.75H5.25V10.5C5.25 10.6989 5.17098 10.8897 5.03033 11.0303C4.88968 11.171 4.69891 11.25 4.5 11.25C4.30109 11.25 4.11032 11.171 3.96967 11.0303C3.82902 10.8897 3.75 10.6989 3.75 10.5ZM15 7.5H17.6897L15 4.81031V7.5Z" fill="#2F80ED"/>
                        </svg>
                    </button>
                    <button
                        onClick={onEmailInvoice}
                        className="flex items-center gap-2 px-8 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Mail size={20} />
                        Email Invoice
                    </button>
                </div>

                {/* Invoice Content - White background */}
                <div className="bg-white  mb-4 rounded-lg shadow-sm">
                    <div className="px-12 py-4">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div className="flex items-center mt-8 justify-center at
                        ">
                            {data.logo ? (
                                <img src={data.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <span className="text-4xl font-medium text-black">Logo</span>
                            )}
                        </div>
                        <div className="text-right">
                            <h1 className="text-[28px] text-gray-900 mb-2">INVOICE</h1>
                            <p className="text-gray-600 mb-1">#{data.billTo.invoiceNumber || 'INV-002'}</p>
                            <p className="text-[14px] text-gray-500 mb-2">Balance Due</p>
                            <p className="text-[16px] font-semibold text-gray-900">{formatCurrency(calculateTotal())}</p>
                        </div>
                    </div>

                    {/* Invoice Details */}     
                    <div className="flex justify-between mb-8">
   
                        <div className="flex-1 text-right">
                            <div className="inline-block text-left space-y-2">
                                <div className="flex justify-between gap-16">
                                    <span className="text-sm text-gray-600">Invoice Date</span>
                                    <span className="text-sm text-gray-900 font-medium">{formatDate(data.billTo.invoiceDate)}</span>
                                </div>
                                <div className="flex justify-between gap-16">
                                    <span className="text-sm text-gray-600">Terms</span>
                                    <span className="text-sm text-gray-900 font-medium">{data.billTo.paymentTerms || 'Net 60'}</span>
                                </div>
                                <div className="flex justify-between gap-16">
                                    <span className="text-sm text-gray-600">Due Date</span>
                                    <span className="text-sm text-gray-900 font-medium">{formatDate(data.billTo.dueDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className="mb-5">
                        <div className="flex justify-between">
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill From</h3>
                                <p className="text-gray-900 font-medium">{data.billFrom.fullName}</p>
                                <p className="text-gray-600 text-sm">{data.billFrom.address || 'Nigeria'}</p>
                                <p className="text-gray-600 text-sm">{data.billFrom.email}</p>
                            </div>
                            <div className="flex-1 text-right">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To</h3>
                                <p className="text-gray-900 font-medium">{data.billTo.customer}</p>
                                <p className="text-gray-600 text-sm">Lagos, Nigeria</p>
                                <p className="text-gray-600 text-sm">{data.billFrom.email}</p>
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
                                {data.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="py-4 px-4 text-gray-900 border border-gray-200">{index + 1}</td>
                                        <td className="py-4 px-4 text-gray-900 border border-gray-200">{item.itemName}</td>
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
                                <span className="text-gray-900">{formatCurrency(calculateSubtotal())}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">VAT ({data.vat}%)</span>
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

                    {/* Signature */}
                    {data.signature && (
                        <div className="mb-12">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Signature</h3>
                            <img src={data.signature} alt="Signature" className="h-16" />
                        </div>
                    )}

                    {/* Note */}
                    {data.customerNote && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                            <p className="text-gray-600 text-sm">{data.customerNote}</p>
                        </div>
                    )}

                    {/* Terms of Payment */}
                    {data.termsAndConditions && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms of Payment</h3>
                            <p className="text-gray-600 text-sm">{data.termsAndConditions}</p>
                        </div>
                    )}

                    {/* Payment Method */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method: Bank Transfer</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bank Name:</span>
                                <span className="text-gray-900 font-medium">{data.paymentDetails.bankAccount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account Number</span>
                                <span className="text-gray-900 font-medium">{data.paymentDetails.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account Name</span>
                                <span className="text-gray-900 font-medium">{data.paymentDetails.accountName}</span>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {submitError && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {submitError}
                        </div>
                    )}

                    {/* Success Message */}
                    {submitSuccess && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            Invoice sent successfully!
                        </div>
                    )}

                    {/* Send Button with Dropdown */}
                    <div className="flex justify-end">
                        <div className="relative" ref={sendDropdownRef}>
                            <button 
                                onClick={() => setShowSendDropdown(!showSendDropdown)}
                                disabled={isSubmitting || submitSuccess}
                                className="flex items-center gap-2 px-8 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Mail size={20} />
                                {isSubmitting ? 'Sending...' : submitSuccess ? 'Sent!' : 'Send'}
                                {!isSubmitting && !submitSuccess && <ChevronDown size={20} />}
                            </button>

                            {/* Send Dropdown */}
                            {showSendDropdown && (
                                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px] z-50">
                                    <p className="px-4 py-2 text-gray-400 text-sm">Send</p>
                                    
                                    {/* Email Option */}
                                    <button
                                        onClick={handleEmailOptionClick}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#344054" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M22 6L12 13L2 6" stroke="#344054" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span className="text-gray-900 font-medium">Email</span>
                                    </button>

                                    {/* WhatsApp Option */}
                                    <button
                                        onClick={handleWhatsAppOptionClick}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382C17.22 14.256 15.996 13.656 15.768 13.572C15.54 13.488 15.372 13.446 15.204 13.698C15.036 13.95 14.562 14.508 14.418 14.676C14.274 14.844 14.13 14.868 13.878 14.742C13.626 14.616 12.834 14.352 11.892 13.512C11.16 12.858 10.668 12.048 10.524 11.796C10.38 11.544 10.506 11.406 10.632 11.28C10.746 11.166 10.884 10.98 11.01 10.836C11.136 10.692 11.178 10.59 11.262 10.422C11.346 10.254 11.304 10.11 11.238 9.984C11.172 9.858 10.674 8.634 10.47 8.13C10.272 7.638 10.068 7.704 9.918 7.698C9.774 7.692 9.606 7.692 9.438 7.692C9.27 7.692 8.994 7.758 8.766 8.01C8.538 8.262 7.896 8.862 7.896 10.086C7.896 11.31 8.79 12.492 8.916 12.66C9.042 12.828 10.668 15.348 13.194 16.404C13.794 16.662 14.262 16.818 14.628 16.932C15.228 17.124 15.774 17.094 16.206 17.028C16.686 16.956 17.682 16.428 17.886 15.846C18.09 15.264 18.09 14.76 18.024 14.658C17.958 14.556 17.79 14.49 17.538 14.364L17.472 14.382ZM12.006 21.6C10.326 21.6 8.694 21.15 7.266 20.304L6.936 20.106L3.006 21.138L4.056 17.304L3.834 16.962C2.904 15.486 2.412 13.776 2.412 12.006C2.412 6.708 6.708 2.412 12.006 2.412C14.568 2.412 16.974 3.408 18.786 5.22C20.598 7.032 21.6 9.438 21.6 12.006C21.6 17.304 17.304 21.6 12.006 21.6ZM20.52 3.486C18.246 1.212 15.222 0 12.006 0C5.442 0 0.012 5.43 0.012 11.994C0.012 14.106 0.564 16.164 1.614 17.976L0 24L6.168 22.416C7.914 23.376 9.888 23.886 11.898 23.886H11.904C18.462 23.886 24 18.456 24 11.892C24 8.676 22.788 5.652 20.52 3.486Z" fill="#1D1D1D"/>
                                        </svg>
                                        <span className="text-gray-900 font-medium">WhatsApp</span>
                                    </button>

                                    {/* Telegram Option */}
                                    <button
                                        onClick={handleTelegramOptionClick}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 0C5.376 0 0 5.376 0 12C0 18.624 5.376 24 12 24C18.624 24 24 18.624 24 12C24 5.376 18.624 0 12 0ZM17.568 8.16C17.388 10.056 16.608 14.664 16.212 16.788C16.044 17.688 15.708 17.988 15.396 18.024C14.7 18.084 14.172 17.568 13.5 17.124C12.444 16.428 11.844 15.996 10.824 15.324C9.636 14.544 10.404 14.112 11.088 13.404C11.268 13.224 14.34 10.428 14.4 10.176C14.4084 10.1327 14.4058 10.088 14.3925 10.0459C14.3792 10.0038 14.3557 9.96579 14.324 9.936C14.244 9.876 14.136 9.9 14.052 9.912C13.932 9.936 12.252 11.04 8.988 13.224C8.508 13.548 8.076 13.704 7.692 13.692C7.26 13.68 6.444 13.452 5.832 13.26C5.076 13.02 4.488 12.9 4.536 12.48C4.56 12.264 4.86 12.048 5.424 11.82C8.928 10.296 11.268 9.3 12.444 8.832C15.78 7.44 16.464 7.2 16.92 7.2C17.016 7.2 17.244 7.224 17.388 7.344C17.508 7.44 17.544 7.572 17.556 7.668C17.544 7.74 17.58 7.956 17.568 8.16Z" fill="#1D1D1D"/>
                                        </svg>
                                        <span className="text-gray-900 font-medium">Telegram</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            {/* Email Invoice Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Email Invoice - Invoice</h2>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    To Request<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={emailTo}
                                    onChange={(e) => setEmailTo(e.target.value)}
                                    placeholder="Jamesoriginalinvoice@gmail.com"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    placeholder="Optional message to your client"
                                    rows={4}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendInvoice}
                                disabled={isSubmitting || !emailTo}
                                className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Modal */}
            {showWhatsAppModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Send via WhatsApp</h2>
                            <button
                                onClick={() => setShowWhatsAppModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number<span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter client phone number"
                                        className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.3333 14.1V16.6C18.3343 16.8321 18.2867 17.0618 18.1937 17.2745C18.1008 17.4871 17.9644 17.678 17.7934 17.8349C17.6224 17.9918 17.4205 18.1113 17.2006 18.1856C16.9808 18.26 16.7478 18.2876 16.5167 18.2667C13.9523 17.9881 11.4892 17.1118 9.32498 15.7083C7.31151 14.4289 5.60443 12.7219 4.32499 10.7083C2.91663 8.53438 2.04019 6.05917 1.76665 3.48334C1.74583 3.25293 1.77321 3.02067 1.84707 2.80139C1.92092 2.58211 2.03963 2.38061 2.19562 2.20972C2.35162 2.03883 2.54149 1.90229 2.75314 1.80881C2.9648 1.71534 3.19348 1.66692 3.42499 1.66667H5.92499C6.32941 1.66273 6.72148 1.80594 7.02812 2.06965C7.33476 2.33336 7.53505 2.69958 7.59165 3.10001C7.69717 3.9001 7.89286 4.68565 8.17499 5.44167C8.2871 5.73998 8.31137 6.06414 8.24491 6.37577C8.17844 6.6874 8.02404 6.97346 7.79998 7.20001L6.74165 8.25834C7.92795 10.3446 9.65536 12.072 11.7417 13.2583L12.8 12.2C13.0265 11.976 13.3126 11.8216 13.6242 11.7551C13.9359 11.6886 14.26 11.7129 14.5583 11.825C15.3144 12.1071 16.0999 12.3028 16.9 12.4083C17.3048 12.4655 17.6745 12.6694 17.9388 12.9813C18.203 13.2932 18.3435 13.6914 18.3333 14.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Optional message to your client"
                                    rows={4}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setShowWhatsAppModal(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendInvoice}
                                disabled={isSubmitting || !phoneNumber}
                                className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Telegram Modal */}
            {showTelegramModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Send via Telegram</h2>
                            <button
                                onClick={() => setShowTelegramModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number<span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter client phone number"
                                        className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.3333 14.1V16.6C18.3343 16.8321 18.2867 17.0618 18.1937 17.2745C18.1008 17.4871 17.9644 17.678 17.7934 17.8349C17.6224 17.9918 17.4205 18.1113 17.2006 18.1856C16.9808 18.26 16.7478 18.2876 16.5167 18.2667C13.9523 17.9881 11.4892 17.1118 9.32498 15.7083C7.31151 14.4289 5.60443 12.7219 4.32499 10.7083C2.91663 8.53438 2.04019 6.05917 1.76665 3.48334C1.74583 3.25293 1.77321 3.02067 1.84707 2.80139C1.92092 2.58211 2.03963 2.38061 2.19562 2.20972C2.35162 2.03883 2.54149 1.90229 2.75314 1.80881C2.9648 1.71534 3.19348 1.66692 3.42499 1.66667H5.92499C6.32941 1.66273 6.72148 1.80594 7.02812 2.06965C7.33476 2.33336 7.53505 2.69958 7.59165 3.10001C7.69717 3.9001 7.89286 4.68565 8.17499 5.44167C8.2871 5.73998 8.31137 6.06414 8.24491 6.37577C8.17844 6.6874 8.02404 6.97346 7.79998 7.20001L6.74165 8.25834C7.92795 10.3446 9.65536 12.072 11.7417 13.2583L12.8 12.2C13.0265 11.976 13.3126 11.8216 13.6242 11.7551C13.9359 11.6886 14.26 11.7129 14.5583 11.825C15.3144 12.1071 16.0999 12.3028 16.9 12.4083C17.3048 12.4655 17.6745 12.6694 17.9388 12.9813C18.203 13.2932 18.3435 13.6914 18.3333 14.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Optional message to your client"
                                    rows={4}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setShowTelegramModal(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendInvoice}
                                disabled={isSubmitting || !phoneNumber}
                                className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6 text-center">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="none">
                                <path fill="#E7FEF8" d="M34.364 6.85c4.257-9.134 17.016-9.134 21.272 0 2.377 5.101 7.923 7.822 13.32 6.535 9.663-2.304 17.618 7.858 13.263 16.944-2.433 5.073-1.063 11.188 3.29 14.683 7.793 6.26 4.954 18.933-4.734 21.128-5.41 1.226-9.249 6.13-9.218 11.776.055 10.11-11.44 15.75-19.165 9.402a11.605 11.605 0 0 0-14.784 0c-7.725 6.348-19.22.709-19.165-9.402.03-5.647-3.808-10.55-9.218-11.776-9.688-2.195-12.527-14.867-4.733-21.128 4.352-3.495 5.722-9.61 3.29-14.683-4.356-9.086 3.599-19.248 13.262-16.944 5.397 1.287 10.943-1.434 13.32-6.534Z"/>
                                <path fill="#40C4AA" d="M51.778 40.597a1.187 1.187 0 0 1 0 1.68l-8.313 8.313a1.187 1.187 0 0 1-1.68 0l-3.563-3.562a1.188 1.188 0 1 1 1.68-1.68l2.723 2.723 7.472-7.474a1.185 1.185 0 0 1 1.68 0ZM60.438 45A15.438 15.438 0 1 1 45 29.562 15.454 15.454 0 0 1 60.438 45Zm-2.376 0A13.063 13.063 0 1 0 45 58.063 13.077 13.077 0 0 0 58.063 45Z"/>
                            </svg>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice sent successfully</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Your invoice has been delivered to your client. You can now track payments
                        </p>

                        <div className="flex justify-between gap-4">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => window.location.href = '/dashboard/invoices'}
                                className="flex-1 px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Back to Invoices
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoicePreview;
