import { formatCompactCurrency } from '@/lib/lottery/utils';
import { memo, useMemo } from 'react';
import { StreakEntry } from './StreakChartTab';

export const StreakTableTab = memo(function StreakTableTab({ data }: { data: StreakEntry[] }) {
  const tableData = useMemo(() => {
    return data.filter((d) => d.drawsCount >= 1).slice(0, 15);
  }, [data]);

  return (
    <div className="glass-card p-4 overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 px-2">Acúmulos</th>
            <th className="text-right py-2 px-2">Vezes</th>
            <th className="text-right py-2 px-2">Arrec. Média</th>
            <th className="text-right py-2 px-2">Prêmio Médio</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((d) => (
            <tr key={d.streakLength} className="border-b border-border hover:bg-white/5">
              <td className="py-1.5 px-2 text-foreground font-semibold">{d.streakLength}</td>
              <td className="py-1.5 px-2 text-right text-muted-foreground">{d.drawsCount}</td>
              <td className="py-1.5 px-2 text-right text-emerald-400">
                {formatCompactCurrency(d.avgCollection)}
              </td>
              <td className="py-1.5 px-2 text-right text-amber-400">
                {d.avgPrize > 0 ? formatCompactCurrency(d.avgPrize) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
