import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectorGroup } from "@shared/schema";

interface SectorSummaryProps {
  sectorGroups: SectorGroup[];
}

export default function SectorSummary({ sectorGroups }: SectorSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

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
    return `${sign}${percent.toFixed(1)}%`;
  };

  const getSectorColor = (sector: string) => {
    const colors = {
      'Banking & Finance': 'blue',
      'Technology': 'purple', 
      'Consumer Goods': 'green',
      'Energy': 'yellow',
      'Healthcare': 'pink',
      'Uncategorized': 'gray'
    };
    return colors[sector as keyof typeof colors] || 'gray';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sector Performance</h2>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid="button-toggle-sectors"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectorGroups.map((group) => {
              const color = getSectorColor(group.sector);
              const isPositive = group.gainLossPercent >= 0;
              
              return (
                <div 
                  key={group.sector}
                  className={`p-4 bg-${color}-50 rounded-lg border border-${color}-100`}
                  data-testid={`sector-${group.sector.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <h4 className={`text-sm font-medium text-${color}-900 mb-2`}>
                    {group.sector}
                  </h4>
                  <p className={`text-lg font-bold text-${color}-800 font-mono`}>
                    {formatCurrency(group.totalPresentValue)}
                  </p>
                  <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(group.gainLossPercent)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
