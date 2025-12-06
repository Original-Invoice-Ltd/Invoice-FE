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
        <div>
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-6 flex items-center gap-4">
                            <Link href="/dashboard/invoices" className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft size={24} />
                            </Link>
                            <h1 className="text-2xl font-semibold text-[#101828]">Create New Invoice</h1>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Invoice Header */}
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
                                    <h2 className="text-lg font-semibold mb-4">Invoice</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Upload your Logo
                                            </label>
                                            <div className="border-2 border-dashed border-[#D0D5DD] rounded-lg p-4 text-center cursor-pointer hover:border-[#2F80ED]">
                                                <Upload className="mx-auto mb-2 text-[#667085]" size={24} />
                                                <p className="text-sm text-[#667085]">Max file size</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Invoice Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="INV-0001"
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bill From */}
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
                                    <h2 className="text-lg font-semibold mb-4">Bill From</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter full name"
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter your address"
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Enter email address"
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Business Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter business name"
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="Enter phone number"
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bill To */}
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
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
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
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
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
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
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
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
                                <div className="flex gap-4">
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

                            {/* Right Column - Summary */}
                            <div className="space-y-6">
                                {/* Language & Currency */}
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
                                    <h3 className="font-semibold mb-4">Language</h3>
                                    <select className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg mb-4">
                                        <option>English</option>
                                    </select>
                                    <h3 className="font-semibold mb-4">Currency</h3>
                                    <select className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg">
                                        <option>NGN</option>
                                    </select>
                                </div>

                                {/* Color Selection */}
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
                                    <h3 className="font-semibold mb-4">Select Color</h3>
                                    <div className="flex gap-2">
                                        <button className="w-8 h-8 rounded bg-[#2F80ED] border-2 border-gray-300"></button>
                                    </div>
                                </div>

                                {/* Template Selection */}
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
                                    <h3 className="font-semibold mb-4">Select Template</h3>
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
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-[#667085]">Subtotal</span>
                                            <span className="font-medium">₦{calculateSubtotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#667085]">VAT (7.5%)</span>
                                            <span className="font-medium">₦{calculateTax().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#667085]">WHT (5%)</span>
                                            <span className="font-medium">₦0.00</span>
                                        </div>
                                        <div className="border-t border-[#E4E7EC] pt-3 flex justify-between">
                                            <span className="font-semibold">Total Due</span>
                                            <span className="font-semibold text-lg">₦{calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
                                    <h3 className="font-semibold mb-4">Payment Details</h3>
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
    );
};

export default CreateInvoicePage;
