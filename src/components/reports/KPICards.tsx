import { KPICardData } from "./types";

interface KPICardsProps {
  data: KPICardData[];
}

const KPICards = ({ data }: KPICardsProps) => {
  const cardWidths = ['258.67px', '260px', '258.67px', '258.67px'];
  const cardHeights = ['117px', '117px', '119px', '117px'];

  return (
    <div 
      className="flex mb-6 w-full"
      style={{ 
        maxWidth: '1108px',
        height: '119px',
        gap: '24px',
        opacity: 1
      }}
    >
      {data.map((kpi, index) => (
        <div
          key={index}
          style={{
            width: cardWidths[index],
            height: cardHeights[index],
            borderRadius: '8px',
            opacity: 1,
            gap: '20px',
            paddingTop: '24px',
            paddingRight: '16px',
            paddingBottom: '24px',
            paddingLeft: '16px',
            background: 'var(--Card-Background, #FFFFFF)',
            border: '1px solid var(--Border-Border, #E4E7EC)'
          }}
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
