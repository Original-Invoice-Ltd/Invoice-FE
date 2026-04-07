"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Mail, Phone, Clock, ChevronDown } from "lucide-react";
import { AdminApi, ContactMessage } from "@/lib/adminApi";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

const AdminContactPage = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selected, setSelected] = useState<ContactMessage | null>(null);
    const { toast, showSuccess, showError, hideToast } = useToast();

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        const res = await AdminApi.getContactMessages({
            email: search || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            page: currentPage,
            size: 10,
        });
        if (res.status === 200 && res.data) {
            const d = res.data as any;
            const list: ContactMessage[] = d.data?.content ?? d.content ?? [];
            setMessages(list);
            setTotalPages(d.data?.totalPages ?? d.totalPages ?? 1);
            setTotalItems(d.data?.totalItems ?? d.totalElements ?? list.length);
        }
        setLoading(false);
    }, [search, statusFilter, startDate, endDate, currentPage]);

    useEffect(() => {
        const t = setTimeout(fetchMessages, search ? 400 : 0);
        return () => clearTimeout(t);
    }, [fetchMessages]);

    const handleStatusChange = async (msg: ContactMessage, status: "NEW" | "READ" | "RESPONDED") => {
        const res = await AdminApi.updateContactStatus(msg.id, status);
        if (res.status === 200) {
            showSuccess(`Status updated to ${status}`);
            await fetchMessages();
            if (selected?.id === msg.id) setSelected({ ...msg, status });
        } else {
            showError(res.error || "Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        if (status === "NEW") return "bg-blue-100 text-blue-700";
        if (status === "READ") return "bg-yellow-100 text-yellow-700";
        if (status === "RESPONDED") return "bg-green-100 text-green-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <div className="p-4 sm:p-6 space-y-4">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Contact Messages</h1>
                <p className="text-gray-600 mt-1 text-sm">Messages from the contact form</p>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 space-y-3">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input type="text" placeholder="Search by email or name..." value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(0); }}
                        className="w-full pl-9 pr-4 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(0); }}
                        className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                        <option value="all">All Status</option>
                        <option value="NEW">New</option>
                        <option value="READ">Read</option>
                        <option value="RESPONDED">Responded</option>
                    </select>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                        className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                        className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Message list */}
                <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="space-y-0">
                            {[1,2,3].map(i => <div key={i} className="p-4 border-b border-[#E4E7EC] animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>)}
                        </div>
                    ) : messages.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-12">No messages found</p>
                    ) : (
                        <div className="divide-y divide-[#E4E7EC]">
                            {messages.map(msg => (
                                <div key={msg.id} onClick={() => setSelected(msg)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? "bg-[#EBF5FF]" : ""}`}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{msg.fullName}</p>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(msg.status)}`}>{msg.status}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 truncate mt-0.5">{msg.subject}</p>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                <Clock size={11} />
                                                {new Date(msg.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="px-4 py-3 border-t border-[#E4E7EC] flex items-center justify-between">
                        <p className="text-xs text-gray-500">{totalItems} messages</p>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
                                className="px-3 py-1 border border-[#E4E7EC] rounded text-xs disabled:opacity-50">Prev</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1}
                                className="px-3 py-1 border border-[#E4E7EC] rounded text-xs disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>

                {/* Message detail */}
                <div className="bg-white border border-[#E4E7EC] rounded-xl p-5">
                    {!selected ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <Mail size={32} className="mb-2 opacity-40" />
                            <p className="text-sm">Select a message to view</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">{selected.fullName}</h3>
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                        <span className="flex items-center gap-1 text-xs text-gray-500"><Mail size={12} />{selected.email}</span>
                                        {selected.phone && <span className="flex items-center gap-1 text-xs text-gray-500"><Phone size={12} />{selected.phone}</span>}
                                    </div>
                                </div>
                                <select value={selected.status}
                                    onChange={e => handleStatusChange(selected, e.target.value as any)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F80ED] ${getStatusColor(selected.status)}`}>
                                    <option value="NEW">NEW</option>
                                    <option value="READ">READ</option>
                                    <option value="RESPONDED">RESPONDED</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Subject</p>
                                <p className="text-sm font-medium text-gray-900">{selected.subject}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Message</p>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-[#E4E7EC]">
                                <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                {selected.agreeToComms && <span className="text-xs text-green-600">Agreed to communications</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
        </div>
    );
};

export default AdminContactPage;
