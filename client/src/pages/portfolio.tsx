import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Holding, Quote, Metrics, PortfolioRow, SectorGroup } from "@shared/schema";
import { calculatePortfolioRows, calculateSectorGroups, calculatePortfolioSummary } from "@/lib/calculations";
import { getSymbolsFromHoldings } from "@/lib/portfolio";
import PortfolioSummary from "@/components/PortfolioSummary";
import SectorSummary from "@/components/SectorSummary";
import PortfolioTable from "@/components/PortfolioTable";
import ErrorBanner from "@/components/ErrorBanner";
import { RefreshCw, Settings, TrendingUp } from "lucide-react";

export default function Portfolio() {
  const [errorCount, setErrorCount] = useState(0);
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  // Fetch static holdings
  const { data: holdings = [], isLoading: holdingsLoading } = useQuery<Holding[]>({
    queryKey: ["/api/holdings"],
    staleTime: Infinity, // Holdings don't change
  });

  // Get unique symbols for API calls
  const symbols = useMemo(() => getSymbolsFromHoldings(holdings), [holdings]);
  const symbolsParam = symbols.join(',');

  // Fetch live quotes every 15 seconds
  const { data: quotes = [], isError: quotesError } = useQuery<Quote[]>({
    queryKey: ["/api/quotes", { symbols: symbolsParam }],
    enabled: symbols.length > 0,
    refetchInterval: 15000, // 15 seconds
    staleTime: 10000,
  });

  // Fetch metrics every 60 seconds
  const { data: metrics = [], isError: metricsError } = useQuery<Metrics[]>({
    queryKey: ["/api/metrics", { symbols: symbolsParam }],
    enabled: symbols.length > 0,
    refetchInterval: 60000, // 60 seconds
    staleTime: 50000,
  });

  // Calculate portfolio rows and groups
  const portfolioRows = useMemo(() => {
    if (!holdings.length) return [];
    return calculatePortfolioRows(holdings, quotes, metrics);
  }, [holdings, quotes, metrics]);

  const sectorGroups = useMemo(() => {
    return calculateSectorGroups(portfolioRows);
  }, [portfolioRows]);

  const portfolioSummary = useMemo(() => {
    return calculatePortfolioSummary(portfolioRows);
  }, [portfolioRows]);

  // Error handling
  const hasErrors = quotesError || metricsError || portfolioRows.some(row => row.hasError);
  
  if (hasErrors && !showErrorBanner) {
    setShowErrorBanner(true);
    setErrorCount(prev => prev + 1);
  }

  const lastUpdated = Math.max(
    ...quotes.map(q => q.timestamp || 0),
    ...metrics.map(m => m.timestamp || 0)
  );

  const formatTime = (timestamp: number) => {
    if (!timestamp) return "--:--:--";
    return new Date(timestamp).toLocaleTimeString();
  };

  if (holdingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900" data-testid="dashboard-title">
                  Portfolio Dashboard
                </h1>
              </div>
              <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Updates Active</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-mono font-medium text-gray-900" data-testid="last-updated">
                  {formatTime(lastUpdated)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  data-testid="button-refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  data-testid="button-settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Banner */}
        {showErrorBanner && (
          <ErrorBanner 
            onDismiss={() => setShowErrorBanner(false)}
            errorCount={errorCount}
          />
        )}

        {/* Portfolio Summary */}
        <PortfolioSummary 
          summary={portfolioSummary}
          totalHoldings={portfolioRows.length}
        />

        {/* Sector Summary */}
        <SectorSummary sectorGroups={sectorGroups} />

        {/* Holdings Table */}
        <PortfolioTable 
          portfolioRows={portfolioRows}
          sectorGroups={sectorGroups}
          lastUpdated={lastUpdated}
        />
      </main>
    </div>
  );
}
