/**
 * LeftIllustrationPanel Component
 * 
 * Displays the promotional left side panel with:
 * - Blue gradient background with decorative elements
 * - Headline and subtext about invoice automation
 * - Illustration of a desk with printer and invoice document
 * 
 * Hidden on mobile, visible on large screens (lg and above)
 */
export default function LeftIllustrationPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-[#0B62F6] relative overflow-hidden rounded-r-2xl">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* Decorative circles for visual interest */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400 rounded-full opacity-15 blur-xl"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center px-8 xl:px-12 text-white">
        <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-4 leading-tight">
          Automate your invoicing, stay tax-compliant,
        </h1>
        <p className="text-base xl:text-lg 2xl:text-xl text-blue-100 mb-8 xl:mb-12">
          Generate invoices, manage clients, and handle VAT/WHT effortlessly.
        </p>

        {/* Illustration: Desk with printer and invoice */}
        <div className="relative mt-8">
          <div className="relative h-64 xl:h-80">
            {/* Desk surface */}
            <div className="absolute bottom-0 left-0 w-full h-24 xl:h-32 bg-gray-300 rounded-t-lg"></div>
            
            {/* Printer */}
            <div className="absolute bottom-24 xl:bottom-32 left-1/4 w-20 xl:w-24 h-16 xl:h-20 bg-gray-700 rounded-lg">
              <div className="absolute top-2 left-2 w-16 xl:w-20 h-2 bg-gray-500 rounded"></div>
            </div>
            
            {/* Invoice document coming out of printer */}
            <div className="absolute bottom-24 xl:bottom-32 left-1/3 w-28 xl:w-32 h-36 xl:h-40 bg-blue-200 rounded-sm transform rotate-6 shadow-lg">
              <div className="p-2 xl:p-3 text-gray-800">
                <div className="text-xs font-bold mb-2">INVOICE</div>
                <div className="h-1 bg-gray-400 mb-1"></div>
                <div className="h-1 bg-gray-300 mb-1 w-3/4"></div>
                <div className="h-1 bg-gray-300 mb-1 w-2/3"></div>
              </div>
            </div>
            
            {/* Windows in background */}
            <div className="absolute top-0 right-0 w-20 xl:w-24 h-28 xl:h-32 border-2 border-blue-300 rounded opacity-30">
              <div className="h-full flex flex-col">
                <div className="h-1/3 border-b border-blue-300"></div>
                <div className="h-1/3 border-b border-blue-300"></div>
              </div>
            </div>
            
            {/* Cabinet */}
            <div className="absolute top-8 right-8 w-12 xl:w-16 h-16 xl:h-20 bg-white rounded opacity-40">
              <div className="absolute top-2 left-2 w-10 xl:w-12 h-6 xl:h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

