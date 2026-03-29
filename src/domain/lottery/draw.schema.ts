import { z } from "zod";

/**
 * Schema for a single lottery draw.
 * Enforces data types and provides defaults for missing fields from legacy or malformed sources.
 */
export const DrawSchema = z.object({
  id: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (must be YYYY-MM-DD)"),
  numbers: z.array(z.number().min(1).max(60)).length(6),
  jackpotWinners: z.number().nonnegative().default(0),
  jackpotPrize: z.number().nonnegative().default(0),
  quinaWinners: z.number().nonnegative().default(0),
  quinaPrize: z.number().nonnegative().default(0),
  quadraWinners: z.number().nonnegative().default(0),
  quadraPrize: z.number().nonnegative().default(0),
  accumulated: z.boolean().default(false),
  totalRevenue: z.number().nonnegative().default(0),
  prizeEstimate: z.number().nonnegative().default(0),
  locations: z.array(z.string()).default([]),
  notes: z.string().optional(),
  accumulatedJackpot: z.number().nonnegative().optional(),
  megaViradaAccumulated: z.number().nonnegative().optional(),
  drawLocation: z.string().optional(),
});

/**
 * Schema for lottery metadata.
 */
export const LotteryMetadataSchema = z.object({
  lastUpdate: z.string(),
  totalDraws: z.number().int().nonnegative(),
  firstDrawDate: z.string(),
  lastDrawDate: z.string(),
});

/**
 * Export derived types from schemas for domain use.
 */
export type DrawInstance = z.infer<typeof DrawSchema>;
export type LotteryMetadataInstance = z.infer<typeof LotteryMetadataSchema>;
