"use client";

import { Download, FileText } from "lucide-react";

const AdminReportsPage = () => {
    const [dateRange, setDateRange] = ("monthly");
    const [startDate, setStartDate] = ("2024-01-01");
    const [endDate, setEndDate] = ("2024-03-31");
    const [exportFormat, setExportFormat] = ("csv");

    const reports = [
        { id: "revenue", name: "Revenue Report", description: "Collected vs invoiced revenue by period", icon: <FileText size={24} /> },
        { id: "subscription", name: "Subscription Report", description: "Plan distribution, upgrades, downgrades, and churn", icon: <FileText size={24} /> },
        { id: "user-activity", name: "User Activity Report", description: "Login frequency, invoice actions, and feature usage", icon: <FileText size={24} /> },
        { id: "invoice-stats", name: "Invoice Statistics Report", description: "Volume, status breakdown, average value, and top creators", icon: <FileText size={24} /> },
        { id: "tax-collection", name: "Tax Collection Report", description: "Tax amounts collected by type, user, and period", icon: <FileText size={24} /> },
        { id: "user-list", name: "User List Export", description: "All user records with profile, plan, and status", icon: <FileText size={24} /> },
        { id: "transaction", name: "Transaction Data Export", description: "Payment records, amounts, methods, and statuses", icon: <FileText size={24} /> },
        { id: "invoice-data", name: "Invoice Data Export", description: "Full platform-wide invoice records", icon: <FileText size={24} /> },
    ];

    const handleGenerateReport = (reportId: string) => {
        console.log(`Generating ${reportId} report for ${startDate} to ${endDate} in ${exportFormat} format`);
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Reports & Export</h1>
                <p className="text-gray-600 mt-1">Generate and export platform data</p>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
                <h2 className="text-[16px] font-bold text-gray-700 mb-4">Report Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Date Range</label>
                        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Export Format</label>
                        <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                            <option value="csv">CSV</option>
                            <option value="xlsx">Excel (.xlsx)</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white border border-[#E4E7EC] rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-[#E8F2FE] rounded-lg text-[#2F80ED]">
                                {report.icon}
                            </div>
                        </div>
                        <h3 className="text-[16px] font-semibold text-gray-600 mb-2">{report.name}</h3>
                        <p className="text-[14px] text-gray-500 mb-4">{report.description}</p>
                        <button
                            onClick={() => handleGenerateReport(report.id)}
                            className="w-full px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center justify-center gap-2"
                        >
                            <Download size={18} />
                            Generate Report
                        </button>
                    </div>
                ))}
            </div>

            <div className="">
                <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Recent Exports</h2>
                <div className="space-y-3">
                    {[
                        { name: "Revenue Report - March 2024", date: "2024-03-15", format: "CSV" },
                        { name: "User List Export", date: "2024-03-14", format: "XLSX" },
                        { name: "Subscription Report - Q1 2024", date: "2024-03-10", format: "CSV" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center border border-gray-200 bg-white justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-3">
                                <FileText size={20} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-[#E8F2FE] text-[#2F80ED] rounded text-xs font-semibold">
                                    {item.format}
                                </span>
                                <button className="p-2 hover:bg-gray-200 rounded-lg">
                                    <Download size={18} className="text-gray-600" />
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
