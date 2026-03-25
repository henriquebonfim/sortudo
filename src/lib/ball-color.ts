import { CHART_COLORS } from '@/components/lottery/chart.constants';

/**
 * Maps a frequency value to an interpolated color on a cold→warm gradient
 * (blue → green → amber → red) based on its relative position in [min, max].
 */
export function getBallColor(freq: number, min: number, max: number): string {
  const t = max === min ? 0.5 : (freq - min) / (max - min);
  if (t < 0.33) return interpolate(CHART_COLORS.BLUE, '#22c55e', t / 0.33);
  if (t < 0.66) return interpolate('#22c55e', CHART_COLORS.AMBER, (t - 0.33) / 0.33);
  return interpolate(CHART_COLORS.AMBER, CHART_COLORS.RED, (t - 0.66) / 0.34);
}

function interpolate(a: string, b: string, t: number): string {
  const p = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
}
