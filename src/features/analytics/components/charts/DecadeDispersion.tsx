import { memo } from 'react';

export const DecadeDispersion = memo(function DecadeDispersion({
  fullySpreadPct,
  clusteredPct,
}: {
  fullySpreadPct: number;
  clusteredPct: number;
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground mb-3 font-medium">Dispersão por Dezena</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 rounded-lg border border-success/20 bg-success/10">
          <span className="font-mono font-bold text-lg text-success">{fullySpreadPct}%</span>
          <p className="text-[10px] text-muted-foreground mt-1">6 dezenas diferentes</p>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/10">
          <span className="text-2xl font-display font-bold text-primary">{clusteredPct}%</span>
          <p className="text-[10px] text-muted-foreground mt-1">3+ na mesma dezena</p>
        </div>
      </div>
    </div>
  );
});
