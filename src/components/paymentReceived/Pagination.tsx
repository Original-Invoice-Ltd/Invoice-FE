"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="px-[14px] pb-8 pt-4 border-t border-[#E4E7EC]">
      <div className="w-full max-w-[1080px] h-[40px] flex items-center justify-center gap-6">
        <button 
          className="w-10 h-10 flex items-center justify-center text-[#667085] hover:text-[#101828] disabled:opacity-50" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button 
          className={`w-10 h-10 flex items-center justify-center text-sm ${
            currentPage === 1 ? 'text-[#2F80ED] font-medium' : 'text-[#667085] hover:text-[#101828]'
          }`}
          onClick={() => onPageChange(1)}
        >
          1
        </button>
        <button 
          className={`w-10 h-10 flex items-center justify-center text-sm ${
            currentPage === 2 ? 'text-[#2F80ED] font-medium' : 'text-[#667085] hover:text-[#101828]'
          }`}
          onClick={() => onPageChange(2)}
        >
          2
        </button>
        <button 
          className={`w-10 h-10 flex items-center justify-center text-sm ${
            currentPage === 3 ? 'text-[#2F80ED] font-medium' : 'text-[#667085] hover:text-[#101828]'
          }`}
          onClick={() => onPageChange(3)}
        >
          3
        </button>
        <button 
          className={`w-10 h-10 flex items-center justify-center text-sm ${
            currentPage === 4 ? 'text-[#2F80ED] font-medium' : 'text-[#667085] hover:text-[#101828]'
          }`}
          onClick={() => onPageChange(4)}
        >
          4
        </button>
        <button 
          className={`w-10 h-10 flex items-center justify-center text-sm ${
            currentPage === 5 ? 'text-[#2F80ED] font-medium' : 'text-[#667085] hover:text-[#101828]'
          }`}
          onClick={() => onPageChange(5)}
        >
          5
        </button>
        <span className="text-sm text-[#667085]">...</span>
        <button 
          className={`w-10 h-10 flex items-center justify-center text-sm ${
            currentPage === totalPages ? 'text-[#2F80ED] font-medium' : 'text-[#667085] hover:text-[#101828]'
          }`}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
        <button 
          className="w-10 h-10 flex items-center justify-center text-[#667085] hover:text-[#101828] disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
