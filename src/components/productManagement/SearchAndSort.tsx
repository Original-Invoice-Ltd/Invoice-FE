import { Search, ChevronDown } from "lucide-react";

interface SearchAndSortProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export const SearchAndSort = ({ searchQuery, onSearchChange }: SearchAndSortProps) => {
    return (
        <div className="p-4 flex items-center justify-between border-b border-[#E4E7EC]">
            <h2 className="text-lg font-semibold text-[#101828]">All Products</h2>
            <div className="flex gap-3">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={18} />
                    <input
                        type="text"
                        placeholder="search clients"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] hover:bg-[#F9FAFB]">
                    Sort by
                    <ChevronDown size={16} />
                </button>
            </div>
        </div>
    );
};
