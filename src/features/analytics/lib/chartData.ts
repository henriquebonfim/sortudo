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
    // Bias based on "birthday numbers" (1-31) and "months" (1-12)
    let bias = 20 + Math.random() * 20;
    if (num <= 12) bias += 40 + Math.random() * 20;
    else if (num <= 31) bias += 20 + Math.random() * 20;

    data.push({
      x: i % 10,
      y: Math.floor(i / 10),
      number: num,
      bias: round(bias, 0),
    });
  }
  return data;
}

/**
 * Generates data for Law of Large Numbers (LLN) convergence chart.
 */
export function generateLLNData() {
  const points = [];
  const target = 50; // 50% for parity (simplified)
  let totalTrials = 0;
  let totalSuccesses = 0;

  for (let i = 1; i <= 100; i++) {
    const trialsInBatch = i * 10;
    let batchSuccesses = 0;
    for (let j = 0; j < trialsInBatch; j++) {
      if (Math.random() < 0.5) batchSuccesses++;
    }

    totalTrials += trialsInBatch;
    totalSuccesses += batchSuccesses;

    points.push({
      draws: totalTrials,
      displayDraws: `${totalTrials}`,
      percentage: round((totalSuccesses / totalTrials) * 100, 1),
      theoretical: target,
    });
  }
  return points;
}
