import { Holding, Quote, Metrics, PortfolioRow, SectorGroup } from "@shared/schema";

export function calculatePortfolioRows(
  holdings: Holding[], 
  quotes: Quote[], 
  metrics: Metrics[]
): PortfolioRow[] {
  const quoteMap = new Map(quotes.map(q => [q.symbol, q]));
  const metricsMap = new Map(metrics.map(m => [m.symbol, m]));
  
  const totalInvestment = holdings.reduce((sum, holding) => 
    sum + (holding.purchasePrice * holding.quantity), 0
  );

  return holdings.map(holding => {
    const investment = holding.purchasePrice * holding.quantity;
    const portfolioPercent = (investment / totalInvestment) * 100;
    
    // Try to find quote data
    const normalizedSymbol = normalizeSymbolForLookup(holding.exchange);
    const quote = quoteMap.get(normalizedSymbol);
    const metric = metricsMap.get(normalizedSymbol);
    
    const cmp = quote?.cmp || null;
    const presentValue = cmp ? cmp * holding.quantity : null;
    const gainLoss = presentValue ? presentValue - investment : null;
    const gainLossPercent = gainLoss && investment ? (gainLoss / investment) * 100 : null;
    
    const hasError = Boolean((quote?.error && !quote.cmp) || (metric?.error && !metric.peRatio && !metric.latestEarnings));
    
    return {
      name: holding.name,
      symbol: holding.symbol,
      exchange: holding.exchange,
      purchasePrice: holding.purchasePrice,
      quantity: holding.quantity,
      sector: holding.sector || 'Uncategorized',
      investment,
      portfolioPercent,
      cmp,
      presentValue,
      gainLoss,
      gainLossPercent,
      peRatio: metric?.peRatio || null,
      latestEarnings: metric?.latestEarnings || null,
      lastUpdated: Math.max(quote?.timestamp || 0, metric?.timestamp || 0) || null,
      hasError
    };
  });
}

export function calculateSectorGroups(portfolioRows: PortfolioRow[]): SectorGroup[] {
  const sectorMap = new Map<string, PortfolioRow[]>();
  
  portfolioRows.forEach(row => {
    const sector = row.sector || 'Uncategorized';
    if (!sectorMap.has(sector)) {
      sectorMap.set(sector, []);
    }
    sectorMap.get(sector)!.push(row);
  });
  
  return Array.from(sectorMap.entries()).map(([sector, holdings]) => {
    const totalInvestment = holdings.reduce((sum, row) => sum + row.investment, 0);
    const totalPresentValue = holdings.reduce((sum, row) => sum + (row.presentValue || row.investment), 0);
    const totalGainLoss = totalPresentValue - totalInvestment;
    const gainLossPercent = totalInvestment ? (totalGainLoss / totalInvestment) * 100 : 0;
    
    return {
      sector,
      holdings,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      gainLossPercent
    };
  }).sort((a, b) => {
    // Sort sectors: known sectors first, Uncategorized last
    if (a.sector === 'Uncategorized') return 1;
    if (b.sector === 'Uncategorized') return -1;
    return a.sector.localeCompare(b.sector);
  });
}

export function calculatePortfolioSummary(portfolioRows: PortfolioRow[]) {
  const totalInvestment = portfolioRows.reduce((sum, row) => sum + row.investment, 0);
  const totalPresentValue = portfolioRows.reduce((sum, row) => sum + (row.presentValue || row.investment), 0);
  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalGainLossPercent = totalInvestment ? (totalGainLoss / totalInvestment) * 100 : 0;
  
  return {
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    totalGainLossPercent
  };
}

function normalizeSymbolForLookup(exchange: string | null): string {
  if (!exchange) return '';
  
  // If exchange already has .NS or .BO suffix, return as-is
  if (exchange.endsWith('.NS') || exchange.endsWith('.BO')) {
    return exchange;
  }
  
  // For NSE symbols that are text-based (like HDFCBANK, RELIANCE)
  if (isNaN(Number(exchange))) {
    return `${exchange}.NS`;
  }
  
  // For BSE numeric codes, add .BO suffix
  return `${exchange}.BO`;
}
