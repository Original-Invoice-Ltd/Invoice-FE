"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import Link from "next/link";

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

    return (
        <div className="mt-[6px] m-[-20px]">   {/* Header */}
            <div className="mb-4 flex items-center gap-4">
                <Link href="/dashboard/invoices" className="p-2 text-[#2F80ED] ">
                   <ArrowLeft size={24} />
                </Link>
                <h1 className="text-[20px] font-semibold text-[#101828]">Create New Invoice</h1>
            </div>
            <div className="flex gap-[22px]">
                  <div className="w-[630px]">
                {/* Left Column - Form */}
                <div className="lg:col-span-3 bg-white rounded-lg  p-4">
                    <div className="space-y-6 border border-[#E4E7EC] rounded-lg p-2">
                        {/* Invoice Header */}
                        <div className="p-4">
                            <div className="flex items-center justify-between gap-12">
                                <div className="flex-shrink-0">
                                    <div className="bg-[#F9FAFB] rounded-lg px-12 py-4 flex items-center justify-center">
                                        <h2 className="text-[20px] font-semibold text-[#101828]">Invoice</h2>
                                    </div>
                                </div>
                                <div className="flex-1 max-w-[200px] ml-auto">
                                    <div className="border border-dashed rounded-lg py-3 px-1 text-center cursor-pointer hover:border-[#2F80ED]">
                                        <div className="flex flex-col items-center">
                                           <div className="border-gray-100 border border-2 p-1 px-2  rounded-lg">
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
                        <div className="p-2">
                            <h2 className="text-[20px] font-semibold text-[#101828] mb-4">Bill From</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter full name"
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
                                            placeholder="INV-0012"
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
                                            className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        />
                                    </div>
                                </div>
                            </div>
                                </div>

                                {/* Bill To */}
                                <div className="bg-white rounded-lg p-2">
                                    <h2 className="text-lg font-semibold mb-4">Bill To</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Customer <span className="text-red-500">*</span>
                                            </label>
                                            <select className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                                                <option>Select from saved client</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Invoice Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Payment Terms
                                            </label>
                                            <select className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                                                <option>Select</option>
                                                <option>Net 15</option>
                                                <option>Net 30</option>
                                                <option>Net 60</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Due Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Table Items */}
                                <div className="bg-white rounded-lg  p-2">
                                    <h2 className="text-lg font-semibold mb-4">Table Item</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-[#E4E7EC]">
                                                    <th className="text-left py-3 px-2 text-sm font-medium text-[#667085]">Item/Desc</th>
                                                    <th className="text-left py-3 px-2 text-sm font-medium text-[#667085]">Quantity</th>
                                                    <th className="text-left py-3 px-2 text-sm font-medium text-[#667085]">Rate</th>
                                                    <th className="text-left py-3 px-2 text-sm font-medium text-[#667085]">Tax</th>
                                                    <th className="text-left py-3 px-2 text-sm font-medium text-[#667085]">Amount</th>
                                                    <th className="w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item) => (
                                                    <tr key={item.id} className="border-b border-[#E4E7EC]">
                                                        <td className="py-3 px-2">
                                                            <input
                                                                type="text"
                                                                value={item.itemName}
                                                                onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                                                                placeholder="Item name"
                                                                className="w-full px-2 py-1 border border-[#D0D5DD] rounded focus:outline-none focus:ring-1 focus:ring-[#2F80ED]"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                                className="w-20 px-2 py-1 border border-[#D0D5DD] rounded focus:outline-none focus:ring-1 focus:ring-[#2F80ED]"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <input
                                                                type="number"
                                                                value={item.rate}
                                                                onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                                                className="w-24 px-2 py-1 border border-[#D0D5DD] rounded focus:outline-none focus:ring-1 focus:ring-[#2F80ED]"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <select
                                                                value={item.tax}
                                                                onChange={(e) => updateItem(item.id, 'tax', parseFloat(e.target.value))}
                                                                className="w-20 px-2 py-1 border border-[#D0D5DD] rounded focus:outline-none focus:ring-1 focus:ring-[#2F80ED]"
                                                            >
                                                                <option value="0">0%</option>
                                                                <option value="5">5%</option>
                                                                <option value="10">10%</option>
                                                            </select>
                                                        </td>
                                                        <td className="py-3 px-2 font-medium">
                                                            ₦{item.amount.toFixed(2)}
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <button
                                                                onClick={() => removeRow(item.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button
                                        onClick={addNewRow}
                                        className="mt-4 flex items-center gap-2 text-[#2F80ED] hover:text-[#2563EB]"
                                    >
                                        <Plus size={20} />
                                        Add New Row
                                    </button>
                                </div>

                                {/* Additional Fields */}
                                <div className="bg-white rounded-lg  p-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Customer Note
                                            </label>
                                            <textarea
                                                placeholder="Description"
                                                rows={3}
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Terms & Conditions
                                            </label>
                                            <textarea
                                                placeholder="Description"
                                                rows={3}
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Signature */}
                                <div className="bg-white rounded-lg  p-2">
                                    <label className="block text-sm font-medium text-[#344054] mb-2">
                                        Add Signature
                                    </label>
                                    <button
                                        onClick={() => setShowSignatureModal(true)}
                                        className="px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB]"
                                    >
                                        {signature ? 'Edit Signature' : 'Add Signature'}
                                    </button>
                                </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 p-2">
                            <button className="px-6 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button className="px-6 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50">
                                Save as Draft
                            </button>
                            <button className="px-6 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB]">
                                Preview Invoice
                            </button>
                        </div>
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
                <div className="bg-white rounded-lg w-[320px] ">
                    <div className="space-y-6">
                                {/* Language & Currency */}
                                <div className=" rounded-lg   p-4">
                                    <h3 className="font-medium text-[16px] mb-2">Language</h3>
                                    <div className="relative mb-4">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                                            <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="10" fill="white"/>
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#008751"/>
                                                    <path d="M12 2v20" stroke="white" strokeWidth="2"/>
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
                                    <select className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg">
                                        <option>NGN</option>
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
                                    <select className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg">
                                        <option>Select</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#344054] mb-2">
                                        Account Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter account name"
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
