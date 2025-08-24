import { readFileSync } from 'fs';
import { join } from 'path';
import { Holding, holdingSchema } from '@shared/schema';
import { z } from 'zod';

export interface IStorage {
  getPortfolioHoldings(): Promise<Holding[]>;
}

export class MemStorage implements IStorage {
  private holdings: Holding[] = [];

  constructor() {
    this.loadPortfolioData();
  }

  private loadPortfolioData() {
    try {
      const dataPath = join(process.cwd(), 'data', 'portfolio.json');
      const rawData = readFileSync(dataPath, 'utf-8');
      const jsonData = JSON.parse(rawData);
      
      // Validate and transform the data
      const holdingsArray = z.array(holdingSchema).parse(jsonData);
      this.holdings = holdingsArray;
      
      console.log(`Loaded ${this.holdings.length} portfolio holdings`);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
      this.holdings = [];
    }
  }

  async getPortfolioHoldings(): Promise<Holding[]> {
    return this.holdings;
  }
}

export const storage = new MemStorage();
