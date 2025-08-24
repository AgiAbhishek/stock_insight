import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Portfolio holdings schema
export const holdingSchema = z.object({
  name: z.string(),
  symbol: z.string().nullable(),
  exchange: z.string().nullable(), 
  purchasePrice: z.number().positive(),
  quantity: z.number().positive(),
  sector: z.string().nullable()
});

export const quoteSchema = z.object({
  symbol: z.string(),
  cmp: z.number().nullable(),
  timestamp: z.number(),
  error: z.string().optional()
});

export const metricsSchema = z.object({
  symbol: z.string(),
  peRatio: z.number().nullable(),
  latestEarnings: z.string().nullable(),
  timestamp: z.number(),
  error: z.string().optional()
});

export const portfolioRowSchema = z.object({
  name: z.string(),
  symbol: z.string().nullable(),
  exchange: z.string().nullable(),
  purchasePrice: z.number(),
  quantity: z.number(),
  sector: z.string().nullable(),
  investment: z.number(),
  portfolioPercent: z.number(),
  cmp: z.number().nullable(),
  presentValue: z.number().nullable(),
  gainLoss: z.number().nullable(),
  gainLossPercent: z.number().nullable(),
  peRatio: z.number().nullable(),
  latestEarnings: z.string().nullable(),
  lastUpdated: z.number().nullable(),
  hasError: z.boolean().default(false)
});

export const sectorGroupSchema = z.object({
  sector: z.string(),
  holdings: z.array(portfolioRowSchema),
  totalInvestment: z.number(),
  totalPresentValue: z.number(),
  totalGainLoss: z.number(),
  gainLossPercent: z.number()
});

export type Holding = z.infer<typeof holdingSchema>;
export type Quote = z.infer<typeof quoteSchema>;
export type Metrics = z.infer<typeof metricsSchema>;
export type PortfolioRow = z.infer<typeof portfolioRowSchema>;
export type SectorGroup = z.infer<typeof sectorGroupSchema>;

// API Response schemas
export const quotesResponseSchema = z.array(quoteSchema);
export const metricsResponseSchema = z.array(metricsSchema);

export type QuotesResponse = z.infer<typeof quotesResponseSchema>;
export type MetricsResponse = z.infer<typeof metricsResponseSchema>;
