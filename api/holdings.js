import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
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

  try {
    const filePath = path.join(process.cwd(), 'data', 'portfolio.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const holdings = JSON.parse(fileContents);
    
    res.status(200).json(holdings);
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    res.status(500).json({ error: 'Failed to load portfolio data' });
  }
}