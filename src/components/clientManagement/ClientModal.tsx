"use client";

import { X, Mail, Phone } from "lucide-react";
import CountryDropdown from "@/components/common/CountryDropdown";

interface FormData {
    customerType: string;
    title: string;
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    country: string;
}

interface ClientModalProps {
    isOpen: boolean;
    formData: FormData;
    onClose: () => void;
    onSave: () => void;
    onChange: (data: FormData) => void;
    isLoading?: boolean;
    isEdit?: boolean;
}

const ClientModal = ({ isOpen, formData, onClose, onSave, onChange, isLoading = false, isEdit = false }: ClientModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#667085] hover:text-[#101828]"
                    disabled={isLoading}
                >
                    <X size={20} />
                </button>
                
                <h2 className="text-xl font-semibold text-[#101828] mb-2">
                    {isEdit ? 'Edit Client' : 'Add New Client'}
                </h2>
                <p className="text-sm text-[#667085] mb-6">Save your client's business details to send invoices and track payments easily</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#344054] mb-2">Customer Type*</label>
                        <select 
                            value={formData.customerType || ""}
                            onChange={(e) => onChange({...formData, customerType: e.target.value})}
                            className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            disabled={isLoading}
                        >
                            <option value="">Select customer type</option>
                            <option value="individual">Individual</option>
                            <option value="business">Business</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#344054] mb-2">Title*</label>
                            <select 
                                value={formData.title || "Mr"}
                                onChange={(e) => onChange({...formData, title: e.target.value})}
                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                disabled={isLoading}
                            >
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                                <option value="Miss">Miss</option>
                                <option value="Dr">Dr</option>
                                <option value="Engr">Engr</option>
                                <option value="Hon">Hon</option>
                                <option value="Capt">Capt</option>
                                <option value="Gen">Gen</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#344054] mb-2">Client Full Name*</label>
                            <input 
                                type="text"
                                placeholder="Enter client full name"
                                value={formData.fullName}
                                onChange={(e) => onChange({...formData, fullName: e.target.value})}
                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#344054] mb-2">Business Name*</label>
                        <input 
                            type="text"
                            placeholder="Enter business name"
                            value={formData.businessName}
                            onChange={(e) => onChange({...formData, businessName: e.target.value})}
                            className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#344054] mb-2">Email Address*</label>
                            <div className="relative">
                                <input 
                                    type="email"
                                    placeholder="Enter client email"
                                    value={formData.email}
                                    onChange={(e) => onChange({...formData, email: e.target.value})}
                                    className="w-full pl-4 pr-10 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                    disabled={isLoading}
                                />
                                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#344054] mb-2">Phone Number*</label>
                            <div className="relative">
                                <input 
                                    type="tel"
                                    placeholder="Enter client phone number"
                                    value={formData.phone}
                                    onChange={(e) => onChange({...formData, phone: e.target.value})}
                                    className="w-full pl-4 pr-10 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                    disabled={isLoading}
                                />
                                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={18} />
                            </div>
                        </div>
                    </div>

                    <CountryDropdown
                        value={formData.country || ""}
                        onChange={(value) => onChange({...formData, country: value})}
                        label="Country"
                        placeholder="Select customer country"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center gap-3 mt-6">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onSave}
                        className="px-6 py-3 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                        {isEdit ? 'Update Client' : 'Save Client'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientModal;