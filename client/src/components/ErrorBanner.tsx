import { X, AlertTriangle } from "lucide-react";

interface ErrorBannerProps {
  onDismiss: () => void;
  errorCount: number;
}

export default function ErrorBanner({ onDismiss, errorCount }: ErrorBannerProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-red-50 border border-orange-200 rounded-xl shadow-md p-4 mb-6" data-testid="error-banner">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-orange-900">
              Connection Issues Detected
            </h3>
            <p className="text-sm text-orange-700 mt-1">
              Live market data is temporarily unavailable. Showing last known values.
              {errorCount > 1 && (
                <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                  {errorCount} retries
                </span>
              )}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-orange-600 font-medium">Auto-retry in progress...</span>
            </div>
          </div>
        </div>
        <button 
          className="text-orange-400 hover:text-orange-600 transition-colors p-2 hover:bg-orange-100 rounded-lg"
          onClick={onDismiss}
          data-testid="button-dismiss-error"
          title="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
