import { KPICardData } from "./types";

interface KPICardsProps {
  data: KPICardData[];
}

const KPICards = ({ data }: KPICardsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      {data.map((kpi, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl border border-[#E4E7EC]"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-[#667085]">{kpi.title}</p>
            {kpi.badge && (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
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
          <p className="text-xl lg:text-2xl font-semibold text-[#101828]">{kpi.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
