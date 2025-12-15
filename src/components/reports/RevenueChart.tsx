"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import { RevenueDataPoint } from "./types";

interface RevenueChartProps {
  data: RevenueDataPoint[];
  isEmpty: boolean;
}

const RevenueChart = ({ data, isEmpty }: RevenueChartProps) => {
  const emptyData = [
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ];

  return (
    <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-semibold text-[#000000]">Revenue Over Time</h3>
        <button className="flex items-center gap-2 px-3 py-2 border border-[#D0D5DD] 
                         rounded-lg text-[14px] text-[#344054] hover:bg-[#F9FAFB]">
          This Month
          <ChevronDown size={16} />
        </button>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={isEmpty ? emptyData : data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#667085', fontSize: 12 }}
            axisLine={{ stroke: '#E4E7EC' }}
          />
          <YAxis 
            tick={{ fill: '#667085', fontSize: 12 }}
            axisLine={{ stroke: '#E4E7EC' }}
            tickFormatter={(value) => `₦${value / 1000}k`}
            domain={[0, 500000]}
            ticks={[0, 50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000]}
          />
          {!isEmpty && (
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2F80ED" 
              strokeWidth={2}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
