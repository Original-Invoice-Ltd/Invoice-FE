"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import { StatusDistribution } from "./types";

interface StatusChartProps {
  data: StatusDistribution[];
  isEmpty: boolean;
}

const StatusChart = ({ data, isEmpty }: StatusChartProps) => {
  const overdueAmount = data.find(d => d.name === 'Overdue')?.value || 0;

  // Transform data for recharts
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
  }));

  return (
    <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-semibold text-[#000000]">Status Distribution</h3>
        <button className="flex items-center gap-2 px-3 py-2 border border-[#D0D5DD] 
                         rounded-lg text-[14px] text-[#344054] hover:bg-[#F9FAFB]">
          This Month
          <ChevronDown size={16} />
        </button>
      </div>
      
      {isEmpty ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-8 border-[#E4E7EC]"></div>
        </div>
      ) : (
        <>
          <div className="relative h-[200px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[12px] text-[#667085]">Overdue Invoices</p>
              <p className="text-[20px] font-semibold text-[#000000]">
                ₦{overdueAmount.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-[14px] text-[#344054]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[#000000]">
                    ₦{item.value.toLocaleString()}
                  </span>
                  <span className={`text-[12px] ${
                    item.change.startsWith('+') ? 'text-[#027A48]' : 'text-[#B42318]'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StatusChart;
