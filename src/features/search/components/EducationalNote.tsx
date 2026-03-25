import { formatNumber } from '@/lib/formatters';
import type { SearchResult } from '@/domain/lottery/lottery.types';

interface EducationalNoteProps {
  result: SearchResult;
}

export function EducationalNote({ result }: EducationalNoteProps) {
  return (
    <div className="card-surface p-4">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Em {result.threeHits.length} dos {formatNumber(result.totalAnalyzed)} sorteios, pelo menos 3 dos seus números saíram.
        Isso parece impressionante — mas não rende prêmio nenhum.
      </p>
    </div>
  );
}
