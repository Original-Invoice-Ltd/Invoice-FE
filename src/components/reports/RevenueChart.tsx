"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { RevenueDataPoint, StatusDistribution } from "./types";
import { useTranslation } from "react-i18next";

interface RevenueChartProps {
  data: RevenueDataPoint[];
  isEmpty: boolean;
  period?: 'month' | 'year';
  onPeriodChange?: () => void;
  loading?: boolean;
}

const RevenueChart = ({ data, isEmpty, period = 'month', onPeriodChange, loading = false }: RevenueChartProps) => {
  const { t } = useTranslation();
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
    <div className="bg-white rounded-xl border border-[#E4E7EC] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base lg:text-lg font-semibold text-[#101828]">
          {t('revenue_over_time')}
        </h3>
        <button 
          onClick={onPeriodChange}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border border-[#D0D5DD] rounded-lg 
                   text-xs lg:text-sm text-[#667085] bg-white hover:bg-[#F9FAFB] transition-colors disabled:opacity-50">
          {period === 'month' ? t('this_month') : t('this_year')}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.354 6.35354L8.35403 11.3535C8.30759 11.4 8.25245 11.4369 8.19175 11.4621C8.13105 11.4872 8.06599 11.5002 8.00028 11.5002C7.93457 11.5002 7.86951 11.4872 7.80881 11.4621C7.74811 11.4369 7.69296 11.4 7.64653 11.3535L2.64653 6.35354C2.55271 6.25972 2.5 6.13247 2.5 5.99979C2.5 5.86711 2.55271 5.73986 2.64653 5.64604C2.74035 5.55222 2.8676 5.49951 3.00028 5.49951C3.13296 5.49951 3.26021 5.55222 3.35403 5.64604L8.00028 10.2929L12.6465 5.64604C12.693 5.59958 12.7481 5.56273 12.8088 5.53759C12.8695 5.51245 12.9346 5.49951 13.0003 5.49951C13.066 5.49951 13.131 5.51245 13.1917 5.53759C13.2524 5.56273 13.3076 5.59958 13.354 5.64604C13.4005 5.69249 13.4373 5.74764 13.4625 5.80834C13.4876 5.86904 13.5006 5.93409 13.5006 5.99979C13.5006 6.06549 13.4876 6.13054 13.4625 6.19124C13.4373 6.25193 13.4005 6.30708 13.354 6.35354Z" fill="#444444"/>
          </svg>
        </button>
      </div>
      
      <div className="w-full h-[200px] lg:h-[280px]">
        {loading ? (
          <div className="animate-pulse h-full bg-gray-100 rounded flex items-center justify-center">
            <div className="text-gray-400">{t('loading_chart')}</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={isEmpty ? emptyData : data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2F80ED" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2F80ED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E9ED" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#333436', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#333436', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₦${value / 1000}k`}
                domain={[0, 500000]}
                ticks={[0, 100000, 200000, 300000, 400000, 500000]}
              />
              {!isEmpty && (
                <>
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2F80ED" 
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                    dot={false}
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

interface StatusChartProps {
  data: StatusDistribution[];
  isEmpty: boolean;
}

export const StatusChart = ({ data, isEmpty }: StatusChartProps) => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[#E4E7EC] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base lg:text-lg font-semibold text-[#101828]">
          {t('status_distribution')}
        </h3>
        <button className="flex items-center gap-2 px-3 py-2 border border-[#D0D5DD] rounded-lg 
                         text-xs lg:text-sm text-[#667085] bg-white hover:bg-[#F9FAFB] transition-colors">
          {t('this_month')}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.354 6.35354L8.35403 11.3535C8.30759 11.4 8.25245 11.4369 8.19175 11.4621C8.13105 11.4872 8.06599 11.5002 8.00028 11.5002C7.93457 11.5002 7.86951 11.4872 7.80881 11.4621C7.74811 11.4369 7.69296 11.4 7.64653 11.3535L2.64653 6.35354C2.55271 6.25972 2.5 6.13247 2.5 5.99979C2.5 5.86711 2.55271 5.73986 2.64653 5.64604C2.74035 5.55222 2.8676 5.49951 3.00028 5.49951C3.13296 5.49951 3.26021 5.55222 3.35403 5.64604L8.00028 10.2929L12.6465 5.64604C12.693 5.59958 12.7481 5.56273 12.8088 5.53759C12.8695 5.51245 12.9346 5.49951 13.0003 5.49951C13.066 5.49951 13.131 5.51245 13.1917 5.53759C13.2524 5.56273 13.3076 5.59958 13.354 5.64604C13.4005 5.69249 13.4373 5.74764 13.4625 5.80834C13.4876 5.86904 13.5006 5.93409 13.5006 5.99979C13.5006 6.06549 13.4876 6.13054 13.4625 6.19124C13.4373 6.25193 13.4005 6.30708 13.354 6.35354Z" fill="#444444"/>
          </svg>
        </button>
      </div>
      
      {isEmpty ? (
        <div className="flex items-center justify-center h-[180px]">
          <div className="text-gray-500">{t('no_status_data')}</div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="w-full h-[180px] flex items-center justify-center mb-4">
            {isClient && data.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
            {(!isClient || data.length === 0) && (
              <div className="flex items-center justify-center h-full text-gray-500">
                {data.length === 0 ? t('no_status_data') : t('loading_chart')}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="flex items-center gap-1 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-[#333436] font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-[#101828]">
                    ₦{item.value.toLocaleString()}
                  </span>
                  <span className={`text-xs font-medium ${
                    item.change.startsWith('+') ? 'text-[#40C4AA]' : 'text-[#F04438]'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
