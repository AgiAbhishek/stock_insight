export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
  
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { symbols } = req.query;
    
    if (!symbols) {
      return res.status(400).json({ error: 'Symbols parameter is required' });
    }
  
    const symbolList = symbols.split(',');
    const results = [];
  
    // Fetch quotes concurrently with rate limiting
    const promises = symbolList.map(async (symbol, index) => {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, index * 100));
      return fetchSingleQuote(symbol.trim());
    });
  
    const quotes = await Promise.all(promises);
    
    for (let i = 0; i < symbolList.length; i++) {
      const symbol = symbolList[i].trim();
      const quote = quotes[i];
      
      results.push({
        symbol,
        cmp: quote.cmp,
        timestamp: Date.now(),
        error: quote.error || null
      });
    }
  
    res.status(200).json(results);
  }
  
  async function fetchSingleQuote(symbol) {
    try {
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
        // Validate price - reject unrealistic values for Indian stocks
        if (currentPrice <= 0 || currentPrice > 100000) {
          throw new Error(`Invalid price data: ₹${currentPrice} - outside reasonable range`);
        }
        return { cmp: currentPrice };
      }
  
      throw new Error('No valid price data found');
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error);
      return { cmp: null, error: error.message };
    }
  }