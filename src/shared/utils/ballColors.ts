/**
 * Visual utility for calculating ball colors based on frequency relative to the dataset range.
 */
export function getBallColor(freq: number, min: number, max: number): string {
  const COLD_BLUE = '#3b82f6',
    NEUTRAL_GREEN = '#22c55e',
    WARM_AMBER = '#f59e0b',
    HOT_RED = '#ef4444';
  const t = max === min ? 0.5 : (freq - min) / (max - min);
  const interpolate = (a: string, b: string, t: number) => {
    const parse = (h: string) =>
      [
        parseInt(h.slice(1, 3), 16),
        parseInt(h.slice(3, 5), 16),
        parseInt(h.slice(5, 7), 16),
      ] as const;
    const [ar, ag, ab] = parse(a),
      [br, bg, bb] = parse(b);
    return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
  };
  if (t < 0.33) return interpolate(COLD_BLUE, NEUTRAL_GREEN, t / 0.33);
  if (t < 0.66) return interpolate(NEUTRAL_GREEN, WARM_AMBER, (t - 0.33) / 0.33);
  return interpolate(WARM_AMBER, HOT_RED, (t - 0.66) / 0.34);
}
