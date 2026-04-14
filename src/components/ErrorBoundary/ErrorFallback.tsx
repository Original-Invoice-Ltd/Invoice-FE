"use client";

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorFallbackProps {
    error: Error | null;
    resetError: () => void;
}

const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
    const router = useRouter();

    const handleGoHome = () => {
        resetError();
        router.push('/');
    };

    const handleRetry = () => {
        resetError();
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#FEE4E2] flex items-center justify-center">
                        <AlertTriangle size={40} className="text-[#EF4444]" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-[#101828] mb-3">
                        Something went wrong
                    </h1>
                    <p className="text-[#667085] leading-relaxed mb-4">
                        We encountered an unexpected error. Don't worry, your data is safe. 
                        Please try refreshing the page or return to the home page.
                    </p>

                    {process.env.NODE_ENV === 'development' && error && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-sm text-[#667085] hover:text-[#344054] mb-2">
                                Technical details
                            </summary>
                            <div className="bg-[#F9FAFB] border border-[#E4E7EC] rounded-lg p-4 text-xs text-[#344054] overflow-auto max-h-40">
                                <p className="font-semibold mb-2">{error.name}</p>
                                <p className="mb-2">{error.message}</p>
                                {error.stack && (
                                    <pre className="text-xs whitespace-pre-wrap break-words">
                                        {error.stack}
                                    </pre>
                                )}
                            </div>
                        </details>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleGoHome}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                        aria-label="Go to home page"
                    >
                        <Home size={18} />
                        <span className="font-medium">Go Home</span>
                    </button>
                    <button
                        onClick={handleRetry}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                        aria-label="Retry"
                    >
                        <RefreshCw size={18} />
                        <span className="font-medium">Try Again</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorFallback;
