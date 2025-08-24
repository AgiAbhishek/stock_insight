import { LRUCache } from 'lru-cache';

// Cache for stock quotes - 15 second TTL
export const quotesCache = new LRUCache<string, any>({
  max: 1000,
  ttl: 15_000, // 15 seconds
});

// Cache for metrics (P/E, earnings) - 60 second TTL  
export const metricsCache = new LRUCache<string, any>({
  max: 1000,
  ttl: 60_000, // 60 seconds
});
