import { Wallet, TrendingUp, BarChart3 } from "lucide-react";

interface PortfolioSummaryProps {
  summary: {
    totalInvestment: number;
    totalPresentValue: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
  };
  totalHoldings: number;
}

export default function PortfolioSummary({ summary, totalHoldings }: PortfolioSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const isPositive = summary.totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Total Investment</h3>
          <Wallet className="h-5 w-5 text-blue-600" />
        </div>
        <p 
          className="text-2xl font-bold text-blue-900 font-mono" 
          data-testid="total-investment"
        >
          {formatCurrency(summary.totalInvestment)}
        </p>
        <p className="text-xs text-blue-600 mt-1 font-medium">
          {totalHoldings} holdings
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-md border border-green-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide">Current Value</h3>
          <BarChart3 className="h-5 w-5 text-green-600" />
        </div>
        <p 
          className="text-2xl font-bold text-green-900 font-mono" 
          data-testid="current-value"
        >
          {formatCurrency(summary.totalPresentValue)}
        </p>
        <div className="flex items-center mt-1 space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      </div>
      
      <div className={`rounded-xl shadow-md border p-5 ${
        isPositive 
          ? 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-200' 
          : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-xs font-semibold uppercase tracking-wide ${
            isPositive ? 'text-green-700' : 'text-red-700'
          }`}>Total P&L</h3>
          <TrendingUp className={`h-5 w-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
        </div>
        <p 
          className={`text-2xl font-bold font-mono ${isPositive ? 'text-green-700' : 'text-red-700'}`}
          data-testid="total-pnl"
        >
          {isPositive ? '+' : ''}{formatCurrency(summary.totalGainLoss)}
        </p>
        <p 
          className={`text-xs mt-1 font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
          data-testid="total-pnl-percent"
        >
          {formatPercent(summary.totalGainLossPercent)}
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Performance</h3>
          <TrendingUp className={`h-5 w-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
        </div>
        <p className={`text-lg font-bold font-mono ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
          {formatPercent(summary.totalGainLossPercent)}
        </p>
        <p className="text-xs text-gray-600 mt-1 font-medium">
          Returns
        </p>
      </div>
    </div>
  );
}
