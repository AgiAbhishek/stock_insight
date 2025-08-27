import { useState } from "react";
import { PortfolioRow, SectorGroup } from "@shared/schema";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

interface PortfolioTableProps {
  portfolioRows: PortfolioRow[];
  sectorGroups: SectorGroup[];
  lastUpdated: number;
}

export default function PortfolioTable({ portfolioRows, sectorGroups, lastUpdated }: PortfolioTableProps) {
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set(['Banking & Finance', 'Technology', 'Uncategorized']));

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number | null) => {
    if (percent === null) return '—';
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return '—';
    return num.toLocaleString('en-IN');
  };

  const toggleSector = (sector: string) => {
    const newExpanded = new Set(expandedSectors);
    if (newExpanded.has(sector)) {
      newExpanded.delete(sector);
    } else {
      newExpanded.add(sector);
    }
    setExpandedSectors(newExpanded);
  };

  const getSectorBorderColor = (sector: string) => {
    const colors = {
      'Banking & Finance': 'border-blue-400',
      'Technology': 'border-purple-400',
      'Consumer Goods': 'border-green-400',
      'Energy': 'border-yellow-400',
      'Healthcare': 'border-pink-400',
      'Uncategorized': 'border-gray-400'
    };
    return colors[sector as keyof typeof colors] || 'border-gray-400';
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return "--:--:--";
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Holdings Details</h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Last updated:</span>
              <span className="font-mono font-medium text-blue-600" data-testid="table-last-updated">
                {formatTime(lastUpdated)}
              </span>
            </div>
            <button 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="button-refresh-table"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                Stock Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchase Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investment
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portfolio %
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center justify-end space-x-1">
                  <span>CMP</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Present Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gain/Loss
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                P/E Ratio
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latest Earnings
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sectorGroups.map((group) => {
              const isExpanded = expandedSectors.has(group.sector);
              const borderColor = getSectorBorderColor(group.sector);
              const isPositive = group.gainLossPercent >= 0;
              
              return [
                // Sector Header
                <tr key={`${group.sector}-header`} className={`bg-gray-25 border-l-4 ${borderColor}`}>
                  <td colSpan={10} className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button 
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          onClick={() => toggleSector(group.sector)}
                          data-testid={`button-toggle-${group.sector.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        <h3 className="font-semibold text-gray-900">{group.sector}</h3>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {group.holdings.length} stocks
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-gray-900 font-bold text-lg">
                          {formatCurrency(group.totalPresentValue)}
                        </p>
                        <p className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(group.gainLossPercent)}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>,
                
                // Sector Holdings
                ...(isExpanded ? group.holdings.map((row) => {
                  const gainLossPositive = (row.gainLoss || 0) >= 0;
                  
                  return (
                    <tr 
                      key={`${row.name}-${row.exchange}`}
                      className="hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-blue-200"
                      data-testid={`row-${row.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white hover:bg-gray-50 z-10">
                        <div className="flex flex-col">
                          <div className="font-semibold text-gray-900 text-sm">{row.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{row.symbol || row.exchange}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-700 text-sm">
                        {formatCurrency(row.purchasePrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-700 text-sm">
                        {formatNumber(row.quantity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-semibold text-gray-900">
                        {formatCurrency(row.investment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-600 text-sm">
                        {formatPercent(row.portfolioPercent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span className={`font-mono font-bold ${row.cmp !== null ? 'text-blue-900' : 'text-gray-400'}`}>
                            {formatCurrency(row.cmp)}
                          </span>
                          {row.cmp !== null && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono font-bold text-gray-900">
                        {formatCurrency(row.presentValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {row.gainLoss !== null ? (
                          <div>
                            <div className={`font-mono font-bold ${gainLossPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {gainLossPositive ? '+' : ''}{formatCurrency(row.gainLoss)}
                            </div>
                            <div className={`text-xs font-semibold ${gainLossPositive ? 'text-green-600' : 'text-red-600'}`}>
                              ({formatPercent(row.gainLossPercent)})
                            </div>
                          </div>
                        ) : (
                          <span className="font-mono text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-700 text-sm">
                        {row.peRatio !== null ? row.peRatio.toFixed(1) : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-600 text-sm">
                        {row.latestEarnings || '—'}
                      </td>
                    </tr>
                  );
                }) : [])
              ];
            }).flat()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
