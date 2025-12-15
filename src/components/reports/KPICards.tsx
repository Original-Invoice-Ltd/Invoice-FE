import { KPICardData } from "./types";

interface KPICardsProps {
  data: KPICardData[];
}

const KPICards = ({ data }: KPICardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {data.map((kpi, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#E4E7EC] p-6"
          style={{ minHeight: '120px' }}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-[14px] text-[#667085]">{kpi.title}</p>
            {kpi.badge && (
              <span
                className={`px-2 py-1 rounded text-[12px] font-medium ${
                  kpi.badge.color === 'red'
                    ? 'bg-[#FEF3F2] text-[#B42318]'
                    : kpi.badge.color === 'green'
                    ? 'bg-[#ECFDF3] text-[#027A48]'
                    : 'bg-[#FFFAEB] text-[#B54708]'
                }`}
              >
                {kpi.badge.text}
              </span>
            )}
          </div>
          <p className="text-[28px] font-semibold text-[#000000]">{kpi.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
