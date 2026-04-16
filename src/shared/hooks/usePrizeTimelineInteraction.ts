import { useCallback, useMemo, useState } from 'react';

interface PrizeTimelineDataPoint {
  year: number;
  maxPrize: number;
}

export interface PrizeTimelineSeriesVisibility {
  maxPrize: boolean;
  totalDistributed: boolean;
  totalRevenue: boolean;
}

interface ChartClickState<TData extends { year: number }> {
  activePayload?: Array<{ payload?: TData }>;
}

const DEFAULT_VISIBLE_SERIES: PrizeTimelineSeriesVisibility = {
  maxPrize: true,
  totalDistributed: true,
  totalRevenue: true,
};

export function usePrizeTimelineInteraction<TData extends PrizeTimelineDataPoint>(
  prizeEvolution: TData[] | null | undefined
) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [visibleSeries, setVisibleSeries] =
    useState<PrizeTimelineSeriesVisibility>(DEFAULT_VISIBLE_SERIES);

  const toggleSeries = useCallback((key: keyof PrizeTimelineSeriesVisibility) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const data = useMemo(
    () => prizeEvolution?.filter((entry) => entry.maxPrize > 0) ?? [],
    [prizeEvolution]
  );

  const handleClick = useCallback((state: unknown) => {
    const entries = (state as ChartClickState<TData> | undefined)?.activePayload;
    const year = entries?.[0]?.payload?.year;
    if (typeof year !== 'number') return;

    setSelectedYear((prev) => (prev === year ? null : year));
  }, []);

  return {
    data,
    selectedYear,
    setSelectedYear,
    visibleSeries,
    toggleSeries,
    handleClick,
  };
}
