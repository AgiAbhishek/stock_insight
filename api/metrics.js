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
  
    // Fetch metrics concurrently with rate limiting
    const promises = symbolList.map(async (symbol, index) => {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, index * 150));
      return fetchSingleMetrics(symbol.trim());
    });
  
    const metrics = await Promise.all(promises);
    
    for (let i = 0; i < symbolList.length; i++) {
      const symbol = symbolList[i].trim();
      const metric = metrics[i];
      
      results.push({
        symbol,
        peRatio: metric.peRatio,
        latestEarnings: metric.latestEarnings,
        timestamp: Date.now(),
        error: metric.error || null
      });
    }
  
    res.status(200).json(results);
  }
  
  async function fetchSingleMetrics(symbol) {
    try {
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
      return { peRatio: null, latestEarnings: null, error: error.message };
    }
  }