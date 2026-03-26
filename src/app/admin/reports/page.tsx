"use client";

import { useState, useEffect } from "react";
import { Download, FileText } from "lucide-react";
import { AdminApi } from "@/lib/adminApi";

const AdminReportsPage = () => {
    const [dateRange, setDateRange] = useState("monthly");
    const [startDate, setStartDate] = useState("2024-01-01");
    const [endDate, setEndDate] = useState("2024-03-31");
    const [exportFormat, setExportFormat] = useState("csv");
    const [recentExports, setRecentExports] = useState<any[]>([]);
    const [loadingExports, setLoadingExports] = useState(true);
    const [generatingReport, setGeneratingReport] = useState<string | null>(null);

    const reports = [
        { id: "revenue", name: "Revenue Report", description: "Collected vs invoiced revenue by period" },
        { id: "subscription", name: "Subscription Report", description: "Plan distribution, upgrades, downgrades, and churn" },
        { id: "user-activity", name: "User Activity Report", description: "Login frequency, invoice actions, and feature usage" },
        { id: "invoice-stats", name: "Invoice Statistics Report", description: "Volume, status breakdown, average value, and top creators" },
        { id: "tax-collection", name: "Tax Collection Report", description: "Tax amounts collected by type, user, and period" },
        { id: "user-list", name: "User List Export", description: "All user records with profile, plan, and status" },
        { id: "transaction", name: "Transaction Data Export", description: "Payment records, amounts, methods, and statuses" },
        { id: "invoice-data", name: "Invoice Data Export", description: "Full platform-wide invoice records" },
    ];

    useEffect(() => {
        const fetchRecentExports = async () => {
            setLoadingExports(true);
            const res = await AdminApi.getRecentExports();
            if (res.status === 200 && res.data) {
                setRecentExports(res.data);
            }
            setLoadingExports(false);
        };
        fetchRecentExports();
    }, []);

    const handleGenerateReport = async (reportId: string) => {
        setGeneratingReport(reportId);
        try {
            const res = await AdminApi.generateReport({ reportId, startDate, endDate, format: exportFormat });
            if (res.status === 200 && res.data) {
                // Refresh recent exports after generating
                const exportsRes = await AdminApi.getRecentExports();
                if (exportsRes.status === 200 && exportsRes.data) {
                    setRecentExports(exportsRes.data);
                }
            }
        } finally {
            setGeneratingReport(null);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Reports & Export</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Generate and export platform data</p>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-base font-bold text-gray-700 mb-4">Report Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Date Range</label>
                        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Export Format</label>
                        <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm">
                            <option value="csv">CSV</option>
                            <option value="xlsx">Excel (.xlsx)</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-[#E8F2FE] rounded-lg text-[#2F80ED]">
                                <FileText size={24} />
                            </div>
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-600 mb-2">{report.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-4">{report.description}</p>
                        <button
                            onClick={() => handleGenerateReport(report.id)}
                            disabled={generatingReport === report.id}
                            className="w-full px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                        >
                            <Download size={18} />
                            {generatingReport === report.id ? "Generating..." : "Generate Report"}
                        </button>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Recent Exports</h2>
                {loadingExports ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : recentExports.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No recent exports</p>
                ) : (
                    <div className="space-y-3">
                        {recentExports.map((item, idx) => (
                            <div key={idx} className="flex items-center border border-gray-200 bg-white justify-between p-4 rounded-lg hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <FileText size={20} className="text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.date || item.createdAt}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-[#E8F2FE] text-[#2F80ED] rounded text-xs font-semibold">
                                        {item.format}
                                    </span>
                                    {item.downloadUrl && (
                                        <a href={item.downloadUrl} className="p-2 hover:bg-gray-200 rounded-lg">
                                            <Download size={18} className="text-gray-600" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReportsPage;
