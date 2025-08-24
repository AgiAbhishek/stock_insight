import { X, AlertTriangle } from "lucide-react";

interface ErrorBannerProps {
  onDismiss: () => void;
  errorCount: number;
}

export default function ErrorBanner({ onDismiss, errorCount }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4" data-testid="error-banner">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Live updates temporarily unavailable
            </h3>
            <p className="text-sm text-red-700">
              Retrying connection... Last known values are displayed.
              {errorCount > 1 && ` (${errorCount} failures)`}
            </p>
          </div>
        </div>
        <button 
          className="text-red-400 hover:text-red-600 transition-colors"
          onClick={onDismiss}
          data-testid="button-dismiss-error"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
