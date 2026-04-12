import { memo } from 'react';

export const Legend = memo(function Legend() {
  return (
    <div className="flex gap-4 text-[10px] text-muted-foreground pt-1">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-2 rounded-sm bg-white/10 border-r border-white/20" />
        Esperado (binomial)
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-emerald-400">+X%</span>
        Acima do esperado
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-red-400">-X%</span>
        Abaixo do esperado
      </div>
    </div>
  );
});
