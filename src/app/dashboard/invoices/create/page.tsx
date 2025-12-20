"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import InvoicePreview from "@/components/invoice/InvoicePreview";

interface InvoiceItem {
    id: string;
    itemName: string;
    quantity: number;
    rate: number;
    tax: number;
    amount: number;
}

const CreateInvoicePage = () => {
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Form state
    const [billFrom, setBillFrom] = useState({
        fullName: "",
        email: "",
        address: "",
        phoneNumber: "",
        businessName: ""
    });

    const [billTo, setBillTo] = useState({
        customer: "",
        invoiceName: "",
        paymentTerms: "",
        invoiceDate: "",
        dueDate: ""
    });

    const [customerNote, setCustomerNote] = useState("");
    const [termsAndConditions, setTermsAndConditions] = useState("");
    const [currency, setCurrency] = useState("NGN");
    const [language, setLanguage] = useState("English");
    const [color, setColor] = useState("#2F80ED");
    const [template, setTemplate] = useState("Default");
    const [logo, setLogo] = useState<string | null>(null);

    const [paymentDetails, setPaymentDetails] = useState({
        bankAccount: "",
        accountName: "",
        accountNumber: ""
    });

    const [vat, setVat] = useState(7.5);
    const [wht, setWht] = useState(5);

    const addNewRow = () => {
        const newItem: InvoiceItem = {
            id: Date.now().toString(),
            itemName: "",
            quantity: 1,
            rate: 0,
            tax: 0,
            amount: 0
        };
        setItems([...items, newItem]);
    };

    const removeRow = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === 'quantity' || field === 'rate') {
                    updated.amount = updated.quantity * updated.rate;
                }
                return updated;
            }
            return item;
        }));
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + item.amount, 0);
    };

    const calculateTax = () => {
        return items.reduce((sum, item) => sum + (item.amount * item.tax / 100), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    // Canvas drawing functions
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [showSignatureModal]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL();
        setSignature(dataUrl);
        setShowSignatureModal(false);
    };

    const handlePreviewInvoice = () => {
        setShowPreview(true);
    };

    const handleBackToEdit = () => {
        setShowPreview(false);
    };

    if (showPreview) {
        return (
            <InvoicePreview
                data={{
                    logo,
                    billFrom,
                    billTo,
                    items,
                    customerNote,
                    termsAndConditions,
                    signature,
                    currency,
                    language,
                    color,
                    template,
                    paymentDetails,
                    vat,
                    wht
                }}
                onEdit={handleBackToEdit}
                onEmailInvoice={() => {
                    // Handle email invoice
                    console.log("Email invoice");
                }}
            />
        );
    }

    return (
        <div className="mt-[6px] m-[-20px]">   {/* Header */}
            <div className="mb-4 flex items-center gap-4">
                <Link href="/dashboard/invoices" className="p-2 text-[#2F80ED] ">
                   <ArrowLeft size={24} />
                </Link>
                <h1 className="text-[20px] font-semibold text-[#101828]">Create New Invoice</h1>
            </div>
            <div className="flex gap-[22px] mb-14">
                  <div className="w-[630px]">
                {/* Left Column - Form */}
                <div className="lg:col-span-3 bg-white rounded-lg p-4 space-y-6">
                    {/* First Border: Invoice Header + Bill From + Bill To */}
                    <div className="bg-white rounded-lg border border-[#E4E7EC] p-4 space-y-6">
                        {/* Invoice Header */}
                        <div>
                            <div className="flex items-center justify-between gap-12">
                                <div className="flex-shrink-0">
                                    <div className="bg-[#F8F8FA] flex items-center justify-center border border-[#EDEDED] rounded-lg px-16 py-1">
                                        <h2 className="text-[18px] font-medium text-[#101828]">Invoice</h2>
                                    </div>
                                </div>
                                <div className="flex-1 max-w-[200px] ml-auto">
                                    <div className="border border-dashed border-[#E5E5E5] rounded-lg py-1 px-1 text-center cursor-pointer ">
                                        <div className="flex flex-col items-center">
                                           <div className="border-gray-100 border border-2 p-1 w-12 h-12 rounded-lg">
                                                 <div className="mb-2 text-[#2F80ED] items-center flex  bg-gray-100 px-1 py-1 rounded-lg">
                                               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 2.25C20.0711 2.25 21.75 3.92893 21.75 6V18C21.75 20.0711 20.0711 21.75 18 21.75H6C5.28598 21.75 4.61621 21.55 4.04688 21.2021C3.79222 21.0466 3.55825 20.861 3.34863 20.6514C2.67084 19.9736 2.25 19.0353 2.25 18V6C2.25 3.92893 3.92893 2.25 6 2.25H18ZM6 3.75C4.75736 3.75 3.75 4.75736 3.75 6V18C3.75 18.6215 4.00119 19.1828 4.40918 19.5908C4.53542 19.7171 4.67626 19.8285 4.8291 19.9219C5.16966 20.1299 5.56969 20.25 6 20.25H18C19.2426 20.25 20.25 19.2426 20.25 18V6C20.25 4.75736 19.2426 3.75 18 3.75H6ZM12.6211 10.8154C13.4764 9.92021 14.9098 10.1204 15.5176 11.1807L17.5723 14.7637C18.0473 15.5923 17.5123 16.7498 16.4551 16.75H7.54492C6.45827 16.7497 5.93366 15.5372 6.45996 14.7109L7.54004 13.0156C8.04626 12.2208 9.06446 11.9222 9.91309 12.3662L10.5293 12.6885C10.6466 12.7498 10.7915 12.732 10.8965 12.6221L12.6211 10.8154ZM14.2168 11.9268C14.0958 11.7156 13.8525 11.6985 13.7061 11.8516L11.9805 13.6582C11.4227 14.2418 10.555 14.3948 9.83398 14.0176L9.21777 13.6953C9.08415 13.6254 8.90762 13.6597 8.80469 13.8213L7.89453 15.25H16.1221L14.2168 11.9268ZM9 8C9.55228 8 10 8.44772 10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8Z" fill="#2F80ED"/>
                                                    </svg>
                                            </div>
                                           </div>
                                            <p className="text-[16px] font-medium text-[#101828] mb-1">Upload Business Logo</p>
                                            <p className="text-[12px] text-[#667085]">Max file size 5MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Bill From */}
                        <div>
                            <h2 className="text-[20px] font-semibold text-[#101828] mb-4">Bill From</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter full name"
                                        value={billFrom.fullName}
                                        onChange={(e) => setBillFrom({ ...billFrom, fullName: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                placeholder="Enter email address"
                                                value={billFrom.email}
                                                onChange={(e) => setBillFrom({ ...billFrom, email: e.target.value })}
                                                className="w-full px-3 py-2.5 pr-10 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085]">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.33334 3.33334H16.6667C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33334C2.41668 16.6667 1.66668 15.9167 1.66668 15V5.00001C1.66668 4.08334 2.41668 3.33334 3.33334 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M18.3333 5L10 10.8333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter address"
                                            value={billFrom.address}
                                            onChange={(e) => setBillFrom({ ...billFrom, address: e.target.value })}
                                            className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            value={billFrom.phoneNumber}
                                            onChange={(e) => setBillFrom({ ...billFrom, phoneNumber: e.target.value })}
                                            className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                            Business Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter business name"
                                            value={billFrom.businessName}
                                            onChange={(e) => setBillFrom({ ...billFrom, businessName: e.target.value })}
                                            className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        />
                                    </div>
                                </div>
                            </div>
                                </div>

                        {/* Bill To */}
                        <div>
                                    <h2 className="text-[20px] font-semibold text-[#101828] mb-4">Bill To</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                Customer <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select 
                                                    value={billTo.customer}
                                                    onChange={(e) => setBillTo({ ...billTo, customer: e.target.value })}
                                                    className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] text-[#98A2B3] appearance-none focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                                >
                                                    <option value="">Select from added client</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Invoice Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="INV-0012"
                                                    value={billTo.invoiceName}
                                                    onChange={(e) => setBillTo({ ...billTo, invoiceName: e.target.value })}
                                                    className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Payment Terms
                                                </label>
                                                <div className="relative">
                                                    <select 
                                                        value={billTo.paymentTerms}
                                                        onChange={(e) => setBillTo({ ...billTo, paymentTerms: e.target.value })}
                                                        className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] text-[#98A2B3] appearance-none focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                                    >
                                                        <option value="">Select payment terms</option>
                                                        <option value="Net 15">Net 15</option>
                                                        <option value="Net 30">Net 30</option>
                                                        <option value="Net 60">Net 60</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Invoice Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={billTo.invoiceDate}
                                                    onChange={(e) => setBillTo({ ...billTo, invoiceDate: e.target.value })}
                                                    className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Due Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={billTo.dueDate}
                                                    onChange={(e) => setBillTo({ ...billTo, dueDate: e.target.value })}
                                                    className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                        </div>
                    </div>

                    {/* Second Border: Table Items */}
                    <div className="bg-white rounded-lg border border-[#E4E7EC] p-4">
                                    <h2 className="text-[20px] font-semibold text-[#101828] mb-4">Table Item</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-[#E4E7EC] bg-[#E5E5E5]">
                                                    <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] w-[200px] border-r border-[#E4E7EC]">Item Detail</th>
                                                    <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] border-r border-[#E4E7EC]">Quantity</th>
                                                    <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] border-r border-[#E4E7EC]">Rate</th>
                                                    <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] border-r border-[#E4E7EC]">
                                                        <div className="flex items-center gap-2">
                                                            Tax
                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5 7.5H11C11.1326 7.5 11.2598 7.44732 11.3536 7.35355C11.4473 7.25979 11.5 7.13261 11.5 7V4C11.5 3.86739 11.4473 3.74021 11.3536 3.64645C11.2598 3.55268 11.1326 3.5 11 3.5H5C4.86739 3.5 4.74021 3.55268 4.64645 3.64645C4.55268 3.74021 4.5 3.86739 4.5 4V7C4.5 7.13261 4.55268 7.25979 4.64645 7.35355C4.74021 7.44732 4.86739 7.5 5 7.5ZM5.5 4.5H10.5V6.5H5.5V4.5ZM12.5 1.5H3.5C3.23478 1.5 2.98043 1.60536 2.79289 1.79289C2.60536 1.98043 2.5 2.23478 2.5 2.5V13.5C2.5 13.7652 2.60536 14.0196 2.79289 14.2071C2.98043 14.3946 3.23478 14.5 3.5 14.5H12.5C12.7652 14.5 13.0196 14.3946 13.2071 14.2071C13.3946 14.0196 13.5 13.7652 13.5 13.5V2.5C13.5 2.23478 13.3946 1.98043 13.2071 1.79289C13.0196 1.60536 12.7652 1.5 12.5 1.5ZM12.5 13.5H3.5V2.5H12.5V13.5ZM6.25 9.25C6.25 9.39834 6.20601 9.54334 6.1236 9.66668C6.04119 9.79001 5.92406 9.88614 5.78701 9.94291C5.64997 9.99967 5.49917 10.0145 5.35368 9.98559C5.2082 9.95665 5.07456 9.88522 4.96967 9.78033C4.86478 9.67544 4.79335 9.5418 4.76441 9.39632C4.73547 9.25083 4.75032 9.10003 4.80709 8.96299C4.86386 8.82594 4.95999 8.70881 5.08332 8.6264C5.20666 8.54399 5.35166 8.5 5.5 8.5C5.69891 8.5 5.88968 8.57902 6.03033 8.71967C6.17098 8.86032 6.25 9.05109 6.25 9.25ZM8.75 9.25C8.75 9.39834 8.70601 9.54334 8.6236 9.66668C8.54119 9.79001 8.42406 9.88614 8.28701 9.94291C8.14997 9.99967 7.99917 10.0145 7.85368 9.98559C7.7082 9.95665 7.57456 9.88522 7.46967 9.78033C7.36478 9.67544 7.29335 9.5418 7.26441 9.39632C7.23547 9.25083 7.25032 9.10003 7.30709 8.96299C7.36386 8.82594 7.45999 8.70881 7.58332 8.6264C7.70666 8.54399 7.85166 8.5 8 8.5C8.19891 8.5 8.38968 8.57902 8.53033 8.71967C8.67098 8.86032 8.75 9.05109 8.75 9.25ZM11.25 9.25C11.25 9.39834 11.206 9.54334 11.1236 9.66668C11.0412 9.79001 10.9241 9.88614 10.787 9.94291C10.65 9.99967 10.4992 10.0145 10.3537 9.98559C10.2082 9.95665 10.0746 9.88522 9.96967 9.78033C9.86478 9.67544 9.79335 9.5418 9.76441 9.39632C9.73547 9.25083 9.75033 9.10003 9.80709 8.96299C9.86386 8.82594 9.95999 8.70881 10.0833 8.6264C10.2067 8.54399 10.3517 8.5 10.5 8.5C10.6989 8.5 10.8897 8.57902 11.0303 8.71967C11.171 8.86032 11.25 9.05109 11.25 9.25ZM6.25 11.75C6.25 11.8983 6.20601 12.0433 6.1236 12.1667C6.04119 12.29 5.92406 12.3861 5.78701 12.4429C5.64997 12.4997 5.49917 12.5145 5.35368 12.4856C5.2082 12.4566 5.07456 12.3852 4.96967 12.2803C4.86478 12.1754 4.79335 12.0418 4.76441 11.8963C4.73547 11.7508 4.75032 11.6 4.80709 11.463C4.86386 11.3259 4.95999 11.2088 5.08332 11.1264C5.20666 11.044 5.35166 11 5.5 11C5.69891 11 5.88968 11.079 6.03033 11.2197C6.17098 11.3603 6.25 11.5511 6.25 11.75ZM8.75 11.75C8.75 11.8983 8.70601 12.0433 8.6236 12.1667C8.54119 12.29 8.42406 12.3861 8.28701 12.4429C8.14997 12.4997 7.99917 12.5145 7.85368 12.4856C7.7082 12.4566 7.57456 12.3852 7.46967 12.2803C7.36478 12.1754 7.29335 12.0418 7.26441 11.8963C7.73547 11.7508 7.25032 11.6 7.30709 11.463C7.36386 11.3259 7.45999 11.2088 7.58332 11.1264C7.70666 11.044 7.85166 11 8 11C8.19891 11 8.38968 11.079 8.53033 11.2197C8.67098 11.3603 8.75 11.5511 8.75 11.75ZM11.25 11.75C11.25 11.8983 11.206 12.0433 11.1236 12.1667C11.0412 12.29 10.9241 12.3861 10.787 12.4429C10.65 12.4997 10.4992 12.5145 10.3537 12.4856C10.2082 12.4566 10.0746 12.3852 9.96967 12.2803C9.86478 12.1754 9.79335 12.0418 9.76441 11.8963C9.73547 11.7508 9.75033 11.6 9.80709 11.463C9.86386 11.3259 9.95999 11.2088 10.0833 11.1264C10.2067 11.044 10.3517 11 10.5 11C10.6989 11 10.8897 11.079 11.0303 11.2197C11.171 11.3603 11.25 11.5511 11.25 11.75Z" fill="#7D7F81"/>
                                                            </svg>
                                                        </div>
                                                    </th>
                                                    <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] border-r border-[#E4E7EC]">Amount</th>
                                                    <th className="w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item) => (
                                                    <tr key={item.id} className="border-b border-[#E4E7EC]">
                                                        <td className="py-4 px-4 border-r border-[#E4E7EC]">
                                                            <input
                                                                type="text"
                                                                value={item.itemName}
                                                                onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                                                                className="w-full text-[14px] font-medium text-[#101828] focus:outline-none bg-transparent"
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 text-[14px] text-[#101828] border-r border-[#E4E7EC]">
                                                            {item.quantity.toFixed(2)}
                                                        </td>
                                                        <td className="py-4 px-4 text-[14px] text-[#101828] border-r border-[#E4E7EC]">
                                                            {item.rate.toLocaleString()}
                                                        </td>
                                                        <td className="py-4 px-4 border-r border-[#E4E7EC]">
                                                            <div className="relative inline-flex items-center">
                                                                <select
                                                                    value={item.tax}
                                                                    onChange={(e) => updateItem(item.id, 'tax', parseFloat(e.target.value))}
                                                                    className="appearance-none bg-transparent text-[14px] text-[#101828] pr-6 focus:outline-none cursor-pointer"
                                                                >
                                                                    <option value="0">VAT(0%)</option>
                                                                    <option value="5">VAT(5%)</option>
                                                                    <option value="7.5">VAT(7.5%)</option>
                                                                    <option value="10">VAT(10%)</option>
                                                                </select>
                                                                <svg className="absolute right-0 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-[14px] font-semibold text-[#101828] border-r border-[#E4E7EC]">
                                                            ₦{item.amount.toLocaleString()}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <button
                                                                onClick={() => removeRow(item.id)}
                                                                className="text-[#F04438] hover:text-red-700"
                                                            >
                                                                <X size={20} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button
                                        onClick={addNewRow}
                                        className="mt-4 flex items-center gap-2 px-4 py-2.5 text-[#2F80ED] border border-[#D0D5DD] rounded-lg hover:bg-[#F0F7FF] transition-colors text-[14px] font-medium"
                                    >
                                        <Plus size={18} />
                                        Add New Row
                                    </button>
                    </div>

                    {/* Third Border: Additional Fields + Signature */}
                    <div className="bg-white rounded-lg border border-[#E4E7EC] p-4 space-y-6">
                        <div>
                            <label className="block text-[16px] font-medium text-[#101828] mb-3">
                                Customer Note
                            </label>
                            <textarea
                                placeholder="Placeholder"
                                rows={4}
                                value={customerNote}
                                onChange={(e) => setCustomerNote(e.target.value)}
                                className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-medium text-[#101828] mb-3">
                                Terms & Conditions
                            </label>
                            <textarea
                                placeholder="Placeholder"
                                rows={4}
                                value={termsAndConditions}
                                onChange={(e) => setTermsAndConditions(e.target.value)}
                                className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] resize-none"
                            />
                        </div>
                        {/* Signature */}
                        <div className="flex items-center gap-4">
                            <label className="text-[16px] font-medium text-[#101828]">
                                Add Signature
                            </label>
                            <button
                                onClick={() => setShowSignatureModal(true)}
                                className="flex items-center justify-center w-10 h-10 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons - No Border */}
                    <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <button className="px-8 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50 text-[14px] font-medium">
                                    Cancel
                                </button>
                                <button className="px-8 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50 text-[14px] font-medium">
                                    Save as Draft
                                </button>
                            </div>
                            <button 
                                onClick={handlePreviewInvoice}
                                className="flex items-center gap-2 px-8 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] text-[14px] font-medium"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.7578 1.25C13.2987 1.25007 13.8276 1.36713 14.3105 1.58691C14.7155 1.77119 15.0885 2.02799 15.4092 2.34863L19.6514 6.59082C19.972 6.91146 20.2288 7.28452 20.4131 7.68945C20.6329 8.17244 20.7499 8.70127 20.75 9.24219V19C20.75 21.0711 19.0711 22.75 17 22.75H7C4.92893 22.75 3.25 21.0711 3.25 19V5C3.25 2.92893 4.92893 1.25 7 1.25H12.7578ZM7 2.75C5.75736 2.75 4.75 3.75736 4.75 5V19C4.75 20.2426 5.75736 21.25 7 21.25H17C18.2426 21.25 19.25 20.2426 19.25 19V9.24219C19.2499 8.9177 19.1797 8.60037 19.0479 8.31055C18.9987 8.20264 18.9398 8.09929 18.874 8H15C14.4477 8 14 7.55228 14 7V3.12598C13.9007 3.06015 13.7974 3.00126 13.6895 2.95215C13.3996 2.82026 13.0823 2.75007 12.7578 2.75H7ZM15.25 10.75C15.6642 10.75 16 11.0858 16 11.5V11.8662C16.5728 12.0136 17.0489 12.3242 17.3613 12.7217C17.6172 13.0473 17.5608 13.5194 17.2354 13.7754C16.9097 14.0313 16.4376 13.975 16.1816 13.6494C16.0477 13.479 15.732 13.2725 15.25 13.2725C14.4818 13.2725 14.25 13.7402 14.25 13.8867C14.2501 14.2045 14.3442 14.2907 14.4092 14.3359C14.5279 14.4186 14.78 14.5 15.25 14.5C15.83 14.5 16.4535 14.5891 16.9473 14.9326C17.4946 15.3135 17.7499 15.9094 17.75 16.6133C17.75 17.5939 16.9913 18.3658 16 18.6289V19C16 19.4142 15.6642 19.75 15.25 19.75C14.8358 19.75 14.5 19.4142 14.5 19V18.6328C13.9273 18.4854 13.4511 18.1757 13.1387 17.7783C12.8828 17.4527 12.9392 16.9806 13.2646 16.7246C13.5903 16.4687 14.0624 16.525 14.3184 16.8506C14.4523 17.021 14.768 17.2275 15.25 17.2275C16.0182 17.2275 16.25 16.7598 16.25 16.6133C16.2499 16.2955 16.1558 16.2093 16.0908 16.1641C15.9721 16.0814 15.72 16 15.25 16C14.67 16 14.0465 15.9109 13.5527 15.5674C13.0054 15.1865 12.7501 14.5906 12.75 13.8867C12.75 12.906 13.5086 12.1332 14.5 11.8701V11.5C14.5 11.0858 14.8358 10.75 15.25 10.75ZM12 9.25C12.4142 9.25 12.75 9.58579 12.75 10C12.75 10.4142 12.4142 10.75 12 10.75H7C6.58579 10.75 6.25 10.4142 6.25 10C6.25 9.58579 6.58579 9.25 7 9.25H12ZM11 5.25C11.4142 5.25 11.75 5.58579 11.75 6C11.75 6.41421 11.4142 6.75 11 6.75H7C6.58579 6.75 6.25 6.41421 6.25 6C6.25 5.58579 6.58579 5.25 7 5.25H11Z" fill="white"/>
                                </svg>
                                Preview Invoice
                            </button>
                    </div>
                </div>

                {/* Signature Modal */}
                {showSignatureModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[#101828]">Add Signature</h3>
                            <button 
                                onClick={() => {
                                    setShowSignatureModal(false);
                                    clearCanvas();
                                }}
                                className="text-[#667085] hover:text-[#101828]"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <canvas
                                ref={canvasRef}
                                width={400}
                                height={200}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                className="w-full border-2 border-[#D0D5DD] rounded-lg cursor-crosshair bg-white"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={clearCanvas}
                                className="px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => {
                                    setShowSignatureModal(false);
                                    clearCanvas();
                                }}
                                className="flex-1 px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSignature}
                                className="flex-1 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB]"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
                )}
            </div>

            {/* Right Column - Summary */}
            <div className="bg-white rounded-lg w-[320px] self-start">
                    <div className="space-y-6">
                                {/* Language & Currency */}
                                <div className=" rounded-lg   p-4">
                                    <h3 className="font-medium text-[16px] mb-2">Language</h3>
                                    <div className="relative mb-4">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                                            <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
                                                <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 9.37797C0 13.6777 2.71375 17.343 6.52176 18.756V0C2.71375 1.41289 0 5.07836 0 9.37797Z" fill="#6DA544"/>
                                                    <path d="M20.0003 9.37797C20.0003 5.07836 17.2865 1.41289 13.4785 0V18.7561C17.2865 17.343 20.0003 13.6777 20.0003 9.37797Z" fill="#6DA544"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <select className="w-full pl-12 pr-3 py-2 border border-[#D0D5DD] rounded-lg appearance-none">
                                            <option>English</option>
                                            <option>Hausa</option>
                                            <option>Igbo</option>
                                            <option>Yoruba</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="font-medium text-[16px] mb-2">Currency <span className="text-red-500">*</span></h3>
                                    <select 
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg"
                                    >
                                        <option value="NGN">NGN</option>
                                    </select>
                                </div>

                                {/* Color Selection */}
                                <div className="bg-white rounded-lg  px-4">
                                    <h3 className="font-medium text-[16px] mb-2">Select Color</h3>
                                    <div className="flex gap-2">
                                        <button className="w-8 h-8 rounded bg-[#2F80ED] border-2 border-gray-300"></button>
                                    </div>
                                </div>

                                {/* Template Selection */}
                                <div className="bg-white rounded-lg  p-4">
                                    <h3 className="font-medium text-[16px] mb-2">Select Template</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Default', 'Compact', 'Modern', 'Pro'].map((template) => (
                                            <div key={template} className="border border-[#D0D5DD] rounded p-2 text-center cursor-pointer hover:border-[#2F80ED]">
                                                <div className="h-16 bg-gray-100 rounded mb-2"></div>
                                                <p className="text-xs">{template}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-white rounded-lg  px-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <h3 className=" text-[16px] font-medium">Subtotal</h3>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#667085] text-[18px]">VAT (7.5%)</span>
                                            <span className=" text-[18px] font-semibold">₦{calculateTax().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#667085] text-[18px]">WHT (5%)</span>
                                            <span className=" text-[18px] font-semibold">₦0.00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[18px] text-[#667085]">Total Due</span>
                                            <span className=" text-[18px] font-semibold">₦{calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                        {/* Payment Details */}
                        <div className="p-4">
                            <h3 className="font-medium mb-2 text-[16px]">Payment Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#344054] mb-2">
                                        Bank Account <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        value={paymentDetails.bankAccount}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, bankAccount: e.target.value })}
                                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg"
                                    >
                                        <option value="">Select</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#344054] mb-2">
                                        Account Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter account name"
                                        value={paymentDetails.accountName}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, accountName: e.target.value })}
                                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#344054] mb-2">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter account number"
                                        value={paymentDetails.accountNumber}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })}
                                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        </div>
       
    );
};

export default CreateInvoicePage;
