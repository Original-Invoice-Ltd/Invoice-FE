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
    <div className="bg-[white] rounded-lg border border-[#E4E7EC] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-semibold text-[#000000]">Revenue Over Time</h3>
        <button className="flex items-center gap-2 px-3 py-2 border border-[#D0D5DD] 
                         rounded-lg text-[14px] text-[#344054] hover:bg-[#F9FAFB]">
          This Month
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.354 6.35354L8.35403 11.3535C8.30759 11.4 8.25245 11.4369 8.19175 11.4621C8.13105 11.4872 8.06599 11.5002 8.00028 11.5002C7.93457 11.5002 7.86951 11.4872 7.80881 11.4621C7.74811 11.4369 7.69296 11.4 7.64653 11.3535L2.64653 6.35354C2.55271 6.25972 2.5 6.13247 2.5 5.99979C2.5 5.86711 2.55271 5.73986 2.64653 5.64604C2.74035 5.55222 2.8676 5.49951 3.00028 5.49951C3.13296 5.49951 3.26021 5.55222 3.35403 5.64604L8.00028 10.2929L12.6465 5.64604C12.693 5.59958 12.7481 5.56273 12.8088 5.53759C12.8695 5.51245 12.9346 5.49951 13.0003 5.49951C13.066 5.49951 13.131 5.51245 13.1917 5.53759C13.2524 5.56273 13.3076 5.59958 13.354 5.64604C13.4005 5.69249 13.4373 5.74764 13.4625 5.80834C13.4876 5.86904 13.5006 5.93409 13.5006 5.99979C13.5006 6.06549 13.4876 6.13054 13.4625 6.19124C13.4373 6.25193 13.4005 6.30708 13.354 6.35354Z" fill="#444444"/>
</svg>

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
