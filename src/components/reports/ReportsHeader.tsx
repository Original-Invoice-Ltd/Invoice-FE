import { Share2, Download } from "lucide-react";

const ReportsHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-[32px] leading-[120%] text-[#000000]" 
            style={{ fontFamily: 'Inter Tight, sans-serif' }}>
          Reports & Analytics
        </h1>
        <p className="text-[16px] leading-[140%] text-[#667085]" 
           style={{ fontFamily: 'Inter Tight, sans-serif' }}>
          See how your business is performing over time.
        </p>
      </div>
      
      <div className="flex gap-3">
        <button className="flex items-center justify-center gap-2 px-4 py-3 h-12 
                         border border-[#2F80ED] rounded-lg text-[#2F80ED] 
                         hover:bg-[#EFF8FF] transition-colors">
          <Share2 size={20} />
          Share
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 h-12 
                         bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] 
                         transition-colors">
          <Download size={20} />
          Export Report
        </button>
      </div>
    </div>
  );
};

export default ReportsHeader;
