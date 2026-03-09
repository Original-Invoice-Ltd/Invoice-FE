"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface PaymentTerm {
    value: string;
    label: string;
    description?: string;
}

interface PaymentTermsDropdownProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const PaymentTermsDropdown = ({ value, onChange, placeholder = "Select payment terms" }: PaymentTermsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const paymentTerms: PaymentTerm[] = [
        { value: "10%", label: "10%" },
        { value: "20%", label: "20%" },
        { value: "30%", label: "30%" },
        { value: "40%", label: "40%" },
        { value: "50%", label: "50%" },
        { value: "60%", label: "60%" },
        { value: "70%", label: "70%" },
        { value: "80%", label: "80%" },
        { value: "90%", label: "90%" },
        { value: "100%", label: "100%" }
    ];

    const selectedTerm = paymentTerms.find(term => term.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] text-left focus:outline-none focus:ring-2 focus:ring-[#2F80ED] flex items-center justify-between"
            >
                <span className={selectedTerm ? "text-[#101828]" : "text-[#98A2B3]"}>
                    {selectedTerm ? selectedTerm.label : placeholder}
                </span>
                <ChevronDown 
                    size={16} 
                    className={`text-[#667085] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-80 overflow-hidden">
                    <div className="max-h-72 overflow-y-auto">
                        {paymentTerms.map((term) => (
                            <button
                                key={term.value}
                                type="button"
                                onClick={() => {
                                    onChange(term.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-b border-[#E4E7EC] last:border-b-0 ${
                                    value === term.value ? 'bg-[#F0F7FF] text-[#2F80ED]' : 'text-[#101828]'
                                }`}
                            >
                                <div className="font-medium">{term.label}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentTermsDropdown;