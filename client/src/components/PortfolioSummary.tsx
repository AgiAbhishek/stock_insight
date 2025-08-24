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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Total Investment</h3>
          <Wallet className="h-5 w-5 text-blue-500" />
        </div>
        <p 
          className="text-3xl font-bold text-gray-900 font-mono" 
          data-testid="total-investment"
        >
          {formatCurrency(summary.totalInvestment)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Across {totalHoldings} holdings
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Current Value</h3>
          <BarChart3 className="h-5 w-5 text-green-500" />
        </div>
        <p 
          className="text-3xl font-bold text-gray-900 font-mono" 
          data-testid="current-value"
        >
          {formatCurrency(summary.totalPresentValue)}
        </p>
        <div className="flex items-center mt-1 space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live prices</span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Total P&L</h3>
          <TrendingUp className={`h-5 w-5 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <p 
          className={`text-3xl font-bold font-mono ${isPositive ? 'text-green-600' : 'text-red-600'}`}
          data-testid="total-pnl"
        >
          {isPositive ? '+' : ''}{formatCurrency(summary.totalGainLoss)}
        </p>
        <p 
          className={`text-sm mt-1 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
          data-testid="total-pnl-percent"
        >
          {formatPercent(summary.totalGainLossPercent)}
        </p>
      </div>
    </div>
  );
}
