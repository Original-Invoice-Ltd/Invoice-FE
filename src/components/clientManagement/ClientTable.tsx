"use client";

import { MoreVertical } from "lucide-react";

interface Client {
    id: string;
    title: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    taxId: string;
    balance: string;
}

interface ClientTableProps {
    clients: Client[];
}

const ClientTable = ({ clients }: ClientTableProps) => {
    return (
        <div className="w-full overflow-x-auto md:-mx-6 scroll-smooth">
            <table className="w-full md:min-w-max">
                <thead className="bg-[#F9FAFB]">
                    <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] whitespace-nowrap">Title</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] whitespace-nowrap">Client Name</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] whitespace-nowrap">Company Name</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] whitespace-nowrap">Email Address</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] whitespace-nowrap">Phone Number</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] whitespace-nowrap">Tax ID</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] whitespace-nowrap">Balance Due</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]"></th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, index) => (
                        <tr key={index} className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]">
                            <td className="px-6 max-w-[150px] truncate py-4 text-sm text-[#101828] whitespace-nowrap">{client.title}</td>
                            <td className="px-6 max-w-[150px] truncate  py-4 text-sm text-[#101828] whitespace-nowrap">{client.name}</td>
                            <td className="px-6 max-w-[150px] truncate py-4 text-sm text-[#101828] whitespace-nowrap">{client.company}</td>
                            <td className="px-6 max-w-[150px] truncate py-4 text-sm text-[#667085] whitespace-nowrap">{client.email}</td>
                            <td className="px-6 max-w-[150px] truncate py-4 text-sm text-[#667085] whitespace-nowrap">{client.phone}</td>
                            <td className="px-6 max-w-[150px] truncate py-4 text-sm text-[#667085] whitespace-nowrap">{client.taxId}</td>
                            <td className="px-6 max-w-[150px] truncate py-4 text-sm text-[#101828] font-medium whitespace-nowrap">{client.balance}</td>
                            <td className="px-6 py-4">
                                <button className="text-[#667085] hover:text-[#101828]">
                                    <MoreVertical size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientTable;
