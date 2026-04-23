"use client";

import { useState } from "react";
import { Download, FileText, BarChart2, Calendar } from "lucide-react";
import { AdminApi } from "@/lib/adminApi";

const downloadCSV = (data: any, filename: string) => {
    let rows: any[] = [];
    if (Array.isArray(data)) {
        rows = data;
    } else if (typeof data === "object" && data !== null) {
        rows = data.content ?? data.data ?? data.records ?? data.items ?? data.transactions ?? data.invoices ?? [data];
    }
    if (!rows.length) { console.warn(`[${filename}] No rows to export`); return; }
    const flatRows = rows.map(r => {
        if (typeof r !== "object" || r === null) return { value: r };
        const flat: any = {};
        Object.entries(r).forEach(([k, v]) => { flat[k] = typeof v === "object" && v !== null ? JSON.stringify(v) : v ?? ""; });
        return flat;
    });
    const headers = Object.keys(flatRows[0]);
    const csv = [headers.join(","), ...flatRows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${filename}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
};

const AdminReportsPage = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [generating, setGenerating] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    const analyticsReports = [
        { id: "revenue", name: "Revenue Report", description: "Collected vs invoiced revenue by period", call: () => AdminApi.getRevenueReport(startDate, endDate), filename: "revenue-report" },
        { id: "subscriptions", name: "Subscription Report", description: "Plan distribution, upgrades, downgrades, and churn", call: () => AdminApi.getSubscriptionReport(startDate, endDate), filename: "subscription-report" },
        { id: "invoice-statistics", name: "Invoice Statistics", description: "Volume, status breakdown, average value, and top creators", call: () => AdminApi.getInvoiceStatisticsReport(startDate, endDate), filename: "invoice-statistics-report" },
        { id: "tax-collection", name: "Tax Collection Report", description: "Tax amounts collected by type, user, and period", call: () => AdminApi.getTaxCollectionReport(startDate, endDate), filename: "tax-collection-report" },
    ];

    const exportReports = [
        {
            id: "export-users", name: "User List Export", filename: "users-export",
            description: "All user records with profile, plan, status and invoice stats",
            call: async () => {
                const res = await AdminApi.getUsers({ page: 0, size: 1000 });
                if (res.status === 200 && res.data) {
                    const list = Array.isArray(res.data) ? res.data : (res.data as any).content ?? (res.data as any).data ?? [];
                    return { status: 200, data: list.map((u: any) => ({ fullName: u.fullName ?? "", email: u.email ?? "", phone: u.phone ?? "", status: u.status ?? "", role: u.role ?? "", plan: u.currentPlan ?? u.plan ?? "", invoiceCount: u.invoiceCount ?? 0, registeredDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : u.registeredDate ?? "" })) };
                }
                return res;
            }
        },
        {
            id: "export-transactions", name: "Transaction Data Export", filename: "transactions-export",
            description: "Payment records, amounts, methods, and statuses",
            call: () => AdminApi.exportTransactions(),
        },
        {
            id: "export-invoices", name: "Invoice Data Export", filename: "invoices-export",
            description: "Full platform-wide invoice records",
            call: async () => {
                const res = await AdminApi.exportInvoices();
                if (res.status === 200 && res.data) return res;
                const usersRes = await AdminApi.getUsers({ page: 0, size: 1000 });
                if (usersRes.status === 200 && usersRes.data) {
                    const list = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data as any).content ?? [];
                    return { status: 200, data: list.map((u: any) => ({ fullName: u.fullName ?? "", email: u.email ?? "", plan: u.currentPlan ?? u.plan ?? "", totalInvoices: u.invoiceCount ?? 0 })) };
                }
                return res;
            }
        },
    ];

    const handleGenerate = async (id: string, filename: string, call: () => Promise<any>) => {
        setGenerating(id);
        setError(null);
        try {
            const res = await call();
            if (res.status === 200 && res.data) {
                setResults(prev => ({ ...prev, [id]: true }));
                if (typeof res.data === "string" && res.data.startsWith("http")) {
                    window.open(res.data, "_blank");
                } else if (typeof res.data === "string") {
                    const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `${filename}.csv`;
                    document.body.appendChild(a); a.click();
                    document.body.removeChild(a); URL.revokeObjectURL(url);
                } else {
                    downloadCSV(res.data, filename);
                }
            } else {
                setError(`${filename}: ${res.error || "No data returned from server"}`);
            }
        } catch {
            setError(`${filename}: Unexpected error`);
        } finally {
            setGenerating(null);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Reports & Export</h1>
                <p className="text-gray-500 mt-1 text-sm">Generate analytics reports and export platform data as CSV</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Date range */}
            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={16} className="text-[#2F80ED]" />
                    <h2 className="text-sm font-semibold text-gray-800">Date Range</h2>
                    <span className="text-xs text-gray-400">— applies to analytics reports</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 bg-[#fafafa] border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 bg-[#fafafa] border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                    </div>
                </div>
            </div>

            {/* Analytics Reports */}
            <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 sm:px-6 py-4 border-b border-[#E4E7EC]">
                    <BarChart2 size={16} className="text-[#2F80ED]" />
                    <h2 className="text-sm font-semibold text-gray-800">Analytics Reports</h2>
                </div>
                <div className="divide-y divide-[#E4E7EC]">
                    {analyticsReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-[#E8F2FE] rounded-lg shrink-0">
                                    <FileText size={16} className="text-[#2F80ED]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{report.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 ml-4 shrink-0">
                                {results[report.id] && (
                                    <span className="text-xs text-green-600 hidden sm:inline">Ready</span>
                                )}
                                <button
                                    onClick={() => handleGenerate(report.id, report.filename, report.call)}
                                    disabled={generating === report.id}
                                    className="px-4 py-2 bg-[#2F80ED] text-white rounded-lg text-xs font-medium hover:bg-[#2868C7] flex items-center gap-1.5 disabled:opacity-50 transition-colors whitespace-nowrap"
                                >
                                    <Download size={14} />
                                    {generating === report.id ? "Generating..." : "Generate"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Data Exports */}
            <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 sm:px-6 py-4 border-b border-[#E4E7EC]">
                    <Download size={16} className="text-[#2F80ED]" />
                    <h2 className="text-sm font-semibold text-gray-800">Data Exports</h2>
                </div>
                <div className="divide-y divide-[#E4E7EC]">
                    {exportReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-[#E8F2FE] rounded-lg shrink-0">
                                    <Download size={16} className="text-[#2F80ED]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{report.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 ml-4 shrink-0">
                                {results[report.id] && (
                                    <span className="text-xs text-green-600 hidden sm:inline">Ready</span>
                                )}
                                <button
                                    onClick={() => handleGenerate(report.id, report.filename, report.call)}
                                    disabled={generating === report.id}
                                    className="px-4 py-2 bg-[#2F80ED] text-white rounded-lg text-xs font-medium hover:bg-[#2868C7] flex items-center gap-1.5 disabled:opacity-50 transition-colors whitespace-nowrap"
                                >
                                    <Download size={14} />
                                    {generating === report.id ? "Exporting..." : "Export"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;
