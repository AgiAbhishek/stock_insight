export function normalizeSymbol(symbol: string): string {
  if (!symbol) return symbol;
  
  // If symbol already has .NS or .BO suffix, return as-is
  if (symbol.endsWith('.NS') || symbol.endsWith('.BO')) {
    return symbol;
  }
  
  // For NSE symbols that are text-based (like HDFCBANK, RELIANCE)
  if (isNaN(Number(symbol))) {
    return `${symbol}.NS`;
  }
  
  // For BSE numeric codes, add .BO suffix
  return `${symbol}.BO`;
}

export function getSymbolsWithExchange(holdings: any[]): string[] {
  return holdings
    .filter(holding => holding.exchange && holding.exchange.trim())
    .map(holding => {
      // Use exchange field as the symbol base
      const symbol = holding.exchange.trim();
      return normalizeSymbol(symbol);
    })
    .filter((symbol, index, array) => array.indexOf(symbol) === index); // Remove duplicates
}
