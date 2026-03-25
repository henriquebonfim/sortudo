import { formatNumber } from '@/lib/formatters';
import { TOTAL_COMBINATIONS, TICKET_PRICE } from '@/domain/lottery/lottery.constants';

interface GenerationStatsProps {
  totalGenerated: number;
}

export function GenerationStats({ totalGenerated }: GenerationStatsProps) {
  return (
    <div className="mt-8 text-center">
      <p className="font-mono text-xs text-muted-foreground tabular-nums">
        Você já gerou {formatNumber(totalGenerated)} combinações. Existem {formatNumber(TOTAL_COMBINATIONS)} possíveis.
      </p>
    </div>
  );
}
