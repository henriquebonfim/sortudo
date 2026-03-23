import type { SearchResult } from '@/domain/lottery/lottery.types';

const PARTIAL_MATCH_ROWS = [
  { label: '6 números', key: 'jackpot' as const, desc: 'Sena' },
  { label: '5 números', key: 'fiveHits' as const, desc: 'Quina' },
  { label: '4 números', key: 'fourHits' as const, desc: 'Quadra' },
  { label: '3 números', key: 'threeHits' as const, desc: 'Terno (sem prêmio)' },
];

interface MatchesTableProps {
  result: SearchResult;
}

export function MatchesTable({ result }: MatchesTableProps) {
  return (
    <div className="card-surface overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Jogo</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Acertos</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ocorrências</th>
          </tr>
        </thead>
        <tbody>
          {PARTIAL_MATCH_ROWS.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-foreground hidden sm:table-cell">{row.desc}</td>
              <td className="px-4 py-3 text-foreground">{row.label}</td>
              <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                {result[row.key].length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
