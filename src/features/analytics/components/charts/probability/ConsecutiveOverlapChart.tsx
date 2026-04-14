import { PieSummaryChart } from '@/features/analytics/components/charts/shared/PieSummaryChart';
import { useAnalyticsActions, useNumberProfile } from '@/hooks/use-analytics';
import { Pagination } from '@/shared/components/ui/Pagination';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useEffect, useMemo, useState } from 'react';

export function ConsecutiveOverlapChart() {
  const meta = useLotteryMeta();
  const profile = useNumberProfile();
  const { calculateStats } = useAnalyticsActions();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Automatically migrate legacy cached data
  useEffect(() => {
    if (profile && !profile.overlapHistory) {
      calculateStats(true);
    }
  }, [profile, calculateStats]);

  const overlaps = profile?.gameOverlaps;

  const chartData = useMemo(() => {
    if (!overlaps) return [];
    return [
      { name: 'Sem Repetições', value: overlaps.zero, color: CHART_COLORS.EMERALD },
      { name: '1 Repetido', value: overlaps.one, color: CHART_COLORS.BLUE },
      {
        name: '2 Repetidos',
        value: Number(overlaps.two.toFixed(2)),
        color: CHART_COLORS.AMBER,
      },
      {
        name: '3+ Repetidos',
        value: Number(overlaps.threePlus.toFixed(2)),
        color: CHART_COLORS.RED,
      },
    ];
  }, [overlaps]);

  if (!meta || !overlaps || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <PieSummaryChart
        chartData={chartData}
        centerContent={
          <>
            <span className="text-foreground font-display font-bold text-2xl">
              {profile.gameOverlaps.totalWithOverlap}
            </span>
            <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
              Jogos
            </span>
          </>
        }
      />

      {profile?.overlapHistory && profile.overlapHistory.length > 0 && (
        <div className="w-full mt-8">
          <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest border-b border-border pb-1">
            Lista Completa
          </h5>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {profile.overlapHistory
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((ex) => (
                <div
                  key={ex.drawId}
                  className="p-2 rounded bg-muted/10 border border-border hover:bg-muted/20 transition-colors flex flex-col gap-1.5"
                >
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-[10px] text-primary font-bold">
                      CONCURSO {ex.prevDrawId} - {ex.drawId}
                    </span>
                    <span className="text-[9px] text-muted-foreground opacity-60">{ex.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-wrap">
                      {ex.numbers.map((n) => (
                        <span
                          key={n}
                          className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/20 text-primary text-[9px] font-bold border border-primary/30"
                        >
                          {String(n).padStart(2, '0')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(profile.overlapHistory.length / pageSize)}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
