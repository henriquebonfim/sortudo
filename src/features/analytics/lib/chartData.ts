import { round } from '@/lib/lottery/utils';

export interface HeatPoint {
  x: number;
  y: number;
  number: number;
  bias: number;
}

/**
 * Generates data for selection bias heatmap.
 */
export function generateBiasData(): HeatPoint[] {
  const data: HeatPoint[] = [];
  for (let i = 0; i < 60; i++) {
    const num = i + 1;
    let baseBias = 20; // Default for 32-60
    if (num <= 12) baseBias = 85; // Months
    else if (num <= 31) baseBias = 60; // Days

    // Add controlled jitter to keep it within the intended visual band mostly
    const bias = baseBias + Math.random() * 14;

    data.push({
      x: i % 10,
      y: Math.floor(i / 10),
      number: num,
      bias: round(bias, 0),
    });
  }
  return data;
}

