import { ODDS_DATA } from './oddsVisualizer.constants';

/**
 * Calculates a visual width multiplier using a logarithmic scale
 * to normalize vastly different probabilities (e.g., 1e-8 vs 1e-4) into a 1-100% range.
 */
export const getVisualWidth = (probability: number): number => {
  const minProb = ODDS_DATA[0].probability;
  const maxProb = ODDS_DATA[1].probability;

  const logMin = Math.log10(minProb);
  const logMax = Math.log10(maxProb);
  const logProb = Math.log10(probability);

  const normalized = (logProb - logMin) / (logMax - logMin);

  return Math.max(1, normalized * 100);
};
