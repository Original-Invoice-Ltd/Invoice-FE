"use client";

import { Search, ChevronDown } from "lucide-react";

interface ClientsHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const ClientsHeader = ({ searchQuery, onSearchChange }: ClientsHeaderProps) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#101828]">All Clients</h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-[#F9FAFB] px-4 py-2 rounded-lg">
                    <Search size={18} className="text-[#667085]" />
                    <input
                        type="text"
                        placeholder="search clients"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-transparent outline-none text-sm w-48"
                    />
                </div>
                <button className="flex items-center gap-2 text-sm text-[#667085]">
                    Sort by
                    <ChevronDown size={16} />
                </button>
            </div>
        </div>
    );
};

export default ClientsHeader;
