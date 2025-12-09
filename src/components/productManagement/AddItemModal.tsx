import { X } from "lucide-react";
import { FormData } from "./types";

interface AddItemModalProps {
    isOpen: boolean;
    formData: FormData;
    onClose: () => void;
    onFormChange: (data: FormData) => void;
    onSave: () => void;
}

export const AddItemModal = ({ isOpen, formData, onClose, onFormChange, onSave }: AddItemModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(197, 199, 202, 0.90)' }}>
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold text-[#000000]">Add New Item</h2>
                        <button onClick={onClose} className="text-[#667085] hover:text-[#101828]">
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-sm text-[#333436] mb-6">
                        Create a product or service you can reuse in your invoices.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <span className="text-[#000000]">Item Type</span>
                                <span className="text-[#F04438]">*</span>
                            </label>
                            <select
                                value={formData.itemType}
                                onChange={(e) => onFormChange({ ...formData, itemType: e.target.value })}
                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            >
                                <option value="">Select item type</option>
                                <option value="Product">Product</option>
                                <option value="Service">Service</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <span className="text-[#000000]">Item Name</span>
                                <span className="text-[#F04438]">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter item name"
                                value={formData.itemName}
                                onChange={(e) => onFormChange({ ...formData, itemName: e.target.value })}
                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#000000] mb-2">Description</label>
                            <textarea
                                placeholder="Enter details about product/service"
                                value={formData.description}
                                onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <span className="text-[#000000]">Unit</span>
                                    <span className="text-[#F04438]">*</span>
                                </label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => onFormChange({ ...formData, unit: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                >
                                    <option value="">Select unit</option>
                                    <option value="pcs">pcs</option>
                                    <option value="project">project</option>
                                    <option value="year">year</option>
                                    <option value="hour">hour</option>
                                    <option value="Bag">Bag</option>
                                    <option value="Bottle">Bottle</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <span className="text-[#000000]">Unit Price</span>
                                    <span className="text-[#F04438]">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="0.00"
                                        value={formData.unitPrice}
                                        onChange={(e) => onFormChange({ ...formData, unitPrice: e.target.value })}
                                        className="w-full px-4 py-2 pr-20 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                    />
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => onFormChange({ ...formData, currency: e.target.value })}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm border-none focus:outline-none bg-transparent"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="NGN">NGN</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <span className="text-[#000000]">Tax</span>
                                <span className="text-[#F04438]">*</span>
                            </label>
                            <select
                                value={formData.tax}
                                onChange={(e) => onFormChange({ ...formData, tax: e.target.value })}
                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            >
                                <option value="">Select tax type</option>
                                <option value="VAT 7.5%">VAT (7.5%)</option>
                                <option value="WHT 5.0%">WHT (5.0)</option>
                                <option value="PAYE">PAYE</option>
                                <option value="None">None</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6" style={{ width: '652px', height: '42px' }}>
                        <button
                            onClick={onClose}
                            className="rounded-lg"
                            style={{
                                width: '82px',
                                height: '42px',
                                padding: '10px 16px',
                                gap: '8px',
                                border: '1px solid #2F80ED',
                                background: '#FFFFFF',
                                color: '#2F80ED',
                                fontFamily: 'Inter Tight',
                                fontWeight: 500,
                                fontSize: '16px',
                                lineHeight: '140%',
                                letterSpacing: '0.01em',
                                textAlign: 'center'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="rounded-lg"
                            style={{
                                width: '140px',
                                height: '42px',
                                padding: '10px 16px',
                                gap: '8px',
                                background: '#2F80ED',
                                color: '#FFFFFF',
                                fontFamily: 'Inter Tight',
                                fontWeight: 500,
                                fontSize: '16px',
                                lineHeight: '140%',
                                letterSpacing: '0.01em',
                                textAlign: 'center',
                                border: 'none'
                            }}
                        >
                            Save Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
