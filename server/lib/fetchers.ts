import { quotesCache, metricsCache } from './cache.ts';
import { normalizeSymbol } from './symbols.ts';
import Bottleneck from 'bottleneck';
import { Quote, Metrics } from '@shared/schema';

// Rate limiter to prevent overwhelming external APIs
const limiter = new Bottleneck({
  minTime: 100, // 100ms between requests
  maxConcurrent: 5
});

export async function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  const results: Quote[] = [];
  const timestamp = Date.now();

  console.log(`Fetching quotes for ${symbols.length} symbols: ${symbols.slice(0, 3).join(', ')}${symbols.length > 3 ? '...' : ''}`);

  for (const symbol of symbols) {
    const normalizedSymbol = normalizeSymbol(symbol);
    const cacheKey = `quote:${normalizedSymbol}`;
    
    // Check cache first
    const cached = quotesCache.get(cacheKey);
    if (cached) {
      results.push(cached);
      continue;
    }

    try {
      const quote = await limiter.schedule(() => fetchSingleQuote(normalizedSymbol));
      const quoteData: Quote = {
        symbol: normalizedSymbol,
        cmp: quote.cmp,
        timestamp
      };
      
      quotesCache.set(cacheKey, quoteData);
      results.push(quoteData);
    } catch (error) {
      console.error(`Error fetching quote for ${normalizedSymbol}:`, error);
      const errorQuote: Quote = {
        symbol: normalizedSymbol,
        cmp: null,
        timestamp,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      results.push(errorQuote);
    }
  }

  return results;
}

export async function fetchMetrics(symbols: string[]): Promise<Metrics[]> {
  const results: Metrics[] = [];
  const timestamp = Date.now();

  console.log(`Fetching metrics for ${symbols.length} symbols: ${symbols.slice(0, 3).join(', ')}${symbols.length > 3 ? '...' : ''}`);

  for (const symbol of symbols) {
    const normalizedSymbol = normalizeSymbol(symbol);
    const cacheKey = `metrics:${normalizedSymbol}`;
    
    // Check cache first
    const cached = metricsCache.get(cacheKey);
    if (cached) {
      results.push(cached);
      continue;
    }

    try {
      const metrics = await limiter.schedule(() => fetchSingleMetrics(normalizedSymbol));
      const metricsData: Metrics = {
        symbol: normalizedSymbol,
        peRatio: metrics.peRatio,
        latestEarnings: metrics.latestEarnings,
        timestamp
      };
      
      metricsCache.set(cacheKey, metricsData);
      results.push(metricsData);
    } catch (error) {
      console.error(`Error fetching metrics for ${normalizedSymbol}:`, error);
      const errorMetrics: Metrics = {
        symbol: normalizedSymbol,
        peRatio: null,
        latestEarnings: null,
        timestamp,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      results.push(errorMetrics);
    }
  }

  return results;
}

async function fetchSingleQuote(symbol: string): Promise<{ cmp: number | null }> {
  try {
    // Try Yahoo Finance first
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const currentPrice = result?.meta?.regularMarketPrice || result?.meta?.previousClose;
    
    if (currentPrice && typeof currentPrice === 'number') {
      return { cmp: currentPrice };
    }

    throw new Error('No valid price data found');
  } catch (error) {
    console.error(`Failed to fetch quote for ${symbol}:`, error);
    return { cmp: null };
  }
}

async function fetchSingleMetrics(symbol: string): Promise<{ peRatio: number | null; latestEarnings: string | null }> {
  try {
    // Try Yahoo Finance statistics page
    const yahooUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=defaultKeyStatistics,earnings`;
    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const keyStats = data?.quoteSummary?.result?.[0]?.defaultKeyStatistics;
    const earnings = data?.quoteSummary?.result?.[0]?.earnings;
    
    const peRatio = keyStats?.trailingPE?.raw || null;
    const latestEarnings = earnings?.earningsChart?.quarterly?.[0]?.actual?.raw || null;
    
    return {
      peRatio: peRatio ? Number(peRatio) : null,
      latestEarnings: latestEarnings ? `₹${(latestEarnings / 1e9).toFixed(1)}B` : null
    };
  } catch (error) {
    console.error(`Failed to fetch metrics for ${symbol}:`, error);
    return { peRatio: null, latestEarnings: null };
  }
}
