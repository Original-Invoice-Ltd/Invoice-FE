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
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-[#F9FAFB]">
                    <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Title</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Client Name</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Company Name</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Email Address</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Phone Number</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Tax ID</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Balance Due</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]"></th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client, index) => (
                        <tr key={index} className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]">
                            <td className="px-6 py-4 text-sm text-[#101828]">{client.title}</td>
                            <td className="px-6 py-4 text-sm text-[#101828]">{client.name}</td>
                            <td className="px-6 py-4 text-sm text-[#101828]">{client.company}</td>
                            <td className="px-6 py-4 text-sm text-[#667085]">{client.email}</td>
                            <td className="px-6 py-4 text-sm text-[#667085]">{client.phone}</td>
                            <td className="px-6 py-4 text-sm text-[#667085]">{client.taxId}</td>
                            <td className="px-6 py-4 text-sm text-[#101828] font-medium">{client.balance}</td>
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
