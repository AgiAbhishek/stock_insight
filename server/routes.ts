import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchQuotes, fetchMetrics } from "./lib/fetchers";
import { quotesResponseSchema, metricsResponseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // GET /api/holdings - Return static portfolio holdings
  app.get("/api/holdings", async (req, res) => {
    try {
      const holdings = await storage.getPortfolioHoldings();
      res.json(holdings);
    } catch (error) {
      console.error("Error fetching holdings:", error);
      res.status(500).json({ error: "Failed to fetch holdings" });
    }
  });

  // GET /api/quotes?symbols=SYMBOL1,SYMBOL2 - Return live quotes
  app.get("/api/quotes", async (req, res) => {
    try {
      const symbolsParam = req.query.symbols as string;
      if (!symbolsParam) {
        return res.status(400).json({ error: "symbols parameter is required" });
      }

      const symbols = symbolsParam.split(',').map(s => s.trim()).filter(s => s.length > 0);
      if (symbols.length === 0) {
        return res.status(400).json({ error: "At least one symbol is required" });
      }

      const quotes = await fetchQuotes(symbols);
      const validatedQuotes = quotesResponseSchema.parse(quotes);
      
      res.json(validatedQuotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  // GET /api/metrics?symbols=SYMBOL1,SYMBOL2 - Return P/E ratios and earnings
  app.get("/api/metrics", async (req, res) => {
    try {
      const symbolsParam = req.query.symbols as string;
      if (!symbolsParam) {
        return res.status(400).json({ error: "symbols parameter is required" });
      }

      const symbols = symbolsParam.split(',').map(s => s.trim()).filter(s => s.length > 0);
      if (symbols.length === 0) {
        return res.status(400).json({ error: "At least one symbol is required" });
      }

      const metrics = await fetchMetrics(symbols);
      const validatedMetrics = metricsResponseSchema.parse(metrics);
      
      res.json(validatedMetrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
