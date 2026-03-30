"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { AdminApi } from "@/lib/adminApi";

const downloadCSV = (data: any, filename: string) => {
    let rows: any[] = [];

    if (Array.isArray(data)) {
        rows = data;
    } else if (typeof data === "object" && data !== null) {
        // Try common wrapper keys
        rows = data.content ?? data.data ?? data.records ?? data.items ?? [data];
    }

    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const csv = [
        headers.join(","),
        ...rows.map(r => headers.map(h => `"${r[h] ?? ""}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

const AdminReportsPage = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [generating, setGenerating] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, any>>({});

    const dateReports = [
        { id: "revenue", name: "Revenue Report", filename: "revenue-report", description: "Collected vs invoiced revenue by period", call: () => AdminApi.getRevenueReport(startDate, endDate) },
        { id: "subscriptions", name: "Subscription Report", filename: "subscription-report", description: "Plan distribution, upgrades, downgrades, and churn", call: () => AdminApi.getSubscriptionReport(startDate, endDate) },
        { id: "user-activity", name: "User Activity Report", filename: "user-activity-report", description: "Login frequency, invoice actions, and feature usage", call: () => AdminApi.getUserActivityReport(startDate, endDate) },
        { id: "invoice-statistics", name: "Invoice Statistics Report", filename: "invoice-statistics-report", description: "Volume, status breakdown, average value, and top creators", call: () => AdminApi.getInvoiceStatisticsReport(startDate, endDate) },
        { id: "tax-collection", name: "Tax Collection Report", filename: "tax-collection-report", description: "Tax amounts collected by type, user, and period", call: () => AdminApi.getTaxCollectionReport(startDate, endDate) },
    ];

    const exportReports = [
        { id: "export-users", name: "User List Export", filename: "users-export", description: "All user records with profile, plan, and status", call: () => AdminApi.exportUsers() },
        { id: "export-transactions", name: "Transaction Data Export", filename: "transactions-export", description: "Payment records, amounts, methods, and statuses", call: () => AdminApi.exportTransactions() },
        { id: "export-invoices", name: "Invoice Data Export", filename: "invoices-export", description: "Full platform-wide invoice records", call: () => AdminApi.exportInvoices() },
    ];

    const handleGenerate = async (id: string, filename: string, call: () => Promise<any>) => {
        setGenerating(id);
        try {
            const res = await call();
            if (res.status === 200 && res.data) {
                setResults(prev => ({ ...prev, [id]: true }));
                if (typeof res.data === "string" && res.data.startsWith("http")) {
                    window.open(res.data, "_blank");
                } else {
                    downloadCSV(res.data, filename);
                }
            } else {
                console.error(`[${id}] error:`, res.error);
            }
        } finally {
            setGenerating(null);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Reports & Export</h1>
                <p className="text-gray-600 mt-1 text-sm">Generate and export platform data</p>
            </div>

            {/* Date filters */}
            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                <h2 className="text-sm font-bold text-gray-700 mb-4">Date Range (for date-based reports)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                    </div>
                </div>
            </div>

            {/* Date-based reports */}
            <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Analytics Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dateReports.map((report) => (
                        <div key={report.id} className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow">
                            <div className="p-2 bg-[#E8F2FE] rounded-lg w-fit mb-3">
                                <FileText size={20} className="text-[#2F80ED]" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-1">{report.name}</h3>
                            <p className="text-xs text-gray-500 mb-4">{report.description}</p>
                            <button
                                onClick={() => handleGenerate(report.id, report.filename, report.call)}
                                disabled={generating === report.id}
                                className="w-full px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                <Download size={16} />
                                {generating === report.id ? "Generating..." : "Generate"}
                            </button>
                            {results[report.id] && (
                                <p className="text-xs text-green-600 mt-2 text-center">Report ready</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Export reports */}
            <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Data Exports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exportReports.map((report) => (
                        <div key={report.id} className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow">
                            <div className="p-2 bg-green-50 rounded-lg w-fit mb-3">
                                <Download size={20} className="text-green-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-1">{report.name}</h3>
                            <p className="text-xs text-gray-500 mb-4">{report.description}</p>
                            <button
                                onClick={() => handleGenerate(report.id, report.filename, report.call)}
                                disabled={generating === report.id}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                <Download size={16} />
                                {generating === report.id ? "Exporting..." : "Export"}
                            </button>
                            {results[report.id] && (
                                <p className="text-xs text-green-600 mt-2 text-center">Export ready</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;
