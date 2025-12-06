"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Plus } from "lucide-react";

interface Product {
    id: string;
    itemName: string;
    rate: number;
    description?: string;
}

interface ItemDropdownProps {
    products: Product[];
    onSelect: (product: Product) => void;
    onAddNew: () => void;
}

const ItemDropdown = ({ products, onSelect, onAddNew }: ItemDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredProducts = products.filter(product =>
        product.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
            >
                Select from products
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-80 overflow-hidden">
                    <div className="p-3 border-b border-[#E4E7EC]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={16} />
                            <input
                                type="text"
                                placeholder="Search items"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => {
                                        onSelect(product);
                                        setIsOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-[#F9FAFB] transition-colors border-b border-[#E4E7EC] last:border-b-0"
                                >
                                    <div className="font-medium text-[#101828]">{product.itemName}</div>
                                    <div className="text-sm text-[#667085]">Rate: ₦{product.rate.toLocaleString()}</div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-[#667085]">
                                No result found. Try a different keyword
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            onAddNew();
                            setIsOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-[#2F80ED] hover:bg-[#F9FAFB] transition-colors border-t border-[#E4E7EC] flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add New Item
                    </button>
                </div>
            )}
        </div>
    );
};

export default ItemDropdown;
