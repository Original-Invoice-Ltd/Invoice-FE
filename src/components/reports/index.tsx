"use client";

import { useState } from "react";
import ReportsHeader from "./ReportsHeader";
import KPICards from "./KPICards";
import RevenueChart, { StatusChart } from "./RevenueChart";
import RecentInvoicesTable from "./RecentInvoicesTable";
import { emptyReportsData, filledReportsData } from "./mockData";
import { KPICardData } from "./types";

const ReportsAnalytics = () => {
  // Toggle between empty and filled state for demonstration
  const [hasData, setHasData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const data = hasData ? filledReportsData : emptyReportsData;

  const kpiCards: KPICardData[] = [
    {
      title: "Total Invoiced",
      value: data.kpis.totalInvoiced === 0 ? "₦0" : `₦${data.kpis.totalInvoiced.toLocaleString()}`,
    },
    {
      title: "Payments Received",
      value: data.kpis.paymentsReceived === 0 ? "₦0" : `₦${data.kpis.paymentsReceived.toLocaleString()}`,
    },
    {
      title: "Outstanding Amount",
      value: data.kpis.outstandingAmount === 0 ? "₦0" : `₦${data.kpis.outstandingAmount.toLocaleString()}`,
      badge: { text: "Overdue", color: "red" },
    },
    {
      title: "VAT Collected",
      value: data.kpis.vatCollected === 0 ? "₦0" : `₦${data.kpis.vatCollected.toLocaleString()}`,
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-[1108px] mx-auto">
        <ReportsHeader />
        
        {/* Toggle button for demo purposes - remove in production */}
        <div className="mb-4">
          <button
            onClick={() => setHasData(!hasData)}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
          >
            Toggle {hasData ? "Empty" : "Filled"} State (Demo Only)
          </button>
        </div>

        <KPICards data={kpiCards} />

        <div className="flex flex-col lg:flex-row gap-6 mb-6 w-full max-w-[1108px]">
          <div className="w-full lg:w-[692px]">
            <RevenueChart data={data.revenueData} isEmpty={!hasData} />
          </div>
          <div className="w-full lg:w-[392px]">
            <StatusChart data={data.statusDistribution} isEmpty={!hasData} />
          </div>
        </div>

        <RecentInvoicesTable
          invoices={data.recentInvoices}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
    </div>
  );
};

export default ReportsAnalytics;
