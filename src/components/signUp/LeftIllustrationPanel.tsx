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
    <div className="hidden lg:flex lg:w-1/2 bg-[#1E64F0] relative overflow-hidden">
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

        {/* Illustration */}
        <div className="flex justify-center items-center">
          <img 
            src="/assets/automated_invoice.svg" 
            alt="Automated Invoice Illustration" 
            className="w-full max-w-md xl:max-w-lg"
          />
        </div>
      </div>
    </div>
  );
}

