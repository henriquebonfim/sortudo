import { CHART_COLORS } from '@/shared/constants/chart-colors';

export type FilterMode = 'top30' | 'bottom30' | 'all';

export const FILTER_OPTIONS: { id: FilterMode; label: string }[] = [
  { id: 'top30', label: 'Top 30 mais sorteados' },
  { id: 'bottom30', label: 'Top 30 menos sorteados' },
  { id: 'all', label: 'Todos os 60' },
];

export const LEGEND_ITEMS = [
  { color: CHART_COLORS.RED, label: 'Mais sorteados' },
  { color: CHART_COLORS.AMBER, label: 'Quentes' },
  { color: CHART_COLORS.EMERALD, label: 'Médios' },
  { color: CHART_COLORS.BLUE, label: 'Menos sorteados' },
];
