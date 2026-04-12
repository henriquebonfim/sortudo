import { Game } from '@/lib/lottery/types';
import { formatCurrency } from '@/lib/lottery/utils';
import { MiniBall } from '@/shared/components/MiniBall';
import { Pagination } from '@/shared/components/ui/Pagination';
import { useLotteryStore } from '@/store/lottery';
import { useLotteryMeta } from '@/store/selectors';
import { formatDate } from '@/utils/format';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ListIcon, MapPin, Trophy } from 'lucide-react';
import { memo, useMemo, useState } from 'react';


type SortField = 'id' | 'prize' | 'winners';
type SortOrder = 'asc' | 'desc';


/**
 * Props for individual Winner row component
 */
interface JackpotWinnerRowProps {
  game: Game;
  index: number;
  maxWinners: number;
  maxPrize: number;
}

/**
 * Extracts the single responsibility of rendering a winner row.
 */
const JackpotWinnerRow = memo(function JackpotWinnerRow({
  game,
  index,
  maxWinners,
  maxPrize,
}: JackpotWinnerRowProps) {
  const safeMaxWinners = Math.max(maxWinners, 1);
  const barWidthPercent = (game.jackpotWinners / safeMaxWinners) * 100;

  const gradientBackground = `linear-gradient(90deg, hsl(var(--foreground) / 0.05) ${barWidthPercent}%, transparent ${barWidthPercent}%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: (index % 10) * 0.03 }}
      className="relative flex flex-col gap-4 p-5 rounded-2xl border border-border bg-muted/5 overflow-hidden transition-all hover:bg-muted/10"
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: gradientBackground }}
      />

      {/* Header: ID, Date, Winners */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12  flex items-center justify-center font-mono font-bold text-sm   text-primary   shadow-glow-gold/10">
            #{game.id}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base text-foreground">
                {game.jackpotWinners} {game.jackpotWinners === 1 ? 'ganhador' : 'ganhadores'}
              </span>
              {game.jackpotWinners === maxWinners && (
                <span className="text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-widest bg-primary text-primary-foreground font-bold shadow-lg">
                  recorde
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {formatDate(game.date)}
            </p>
          </div>

        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-primary mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Sena</span>
            {game.jackpotPrize === maxPrize && (
              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider bg-primary/20 text-primary ml-1">
                recorde
              </span>
            )}
          </div>

          <div className="font-mono text-lg font-bold text-foreground leading-none">
            {formatCurrency(game.jackpotPrize)}
          </div>
        </div>
        <div className="relative z-10 flex flex-wrap gap-2 py-2">
          {game.numbers.map((num) => (
            <MiniBall key={num} number={num} size="xs" />
          ))}
        </div>
      </div>

      {/* Locations Section */}
      {game.locations.length > 0 && (
        <div className="relative z-10 pt-3 border-t border-white/5">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1.5">
              {game.locations.map((loc, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-medium text-muted-foreground border border-white/5"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
});

export function AllJackpotWinnersChart() {
  const games = useLotteryStore((s) => s.games);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const statsMeta = useLotteryMeta();
  const winnersList = useMemo(() => {
    return [...games]
      .filter((g) => g.jackpotWinners > 0)
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'id') {
          comparison = a.id - b.id;
        } else if (sortBy === 'prize') {
          comparison = a.jackpotPrize - b.jackpotPrize;
        } else if (sortBy === 'winners') {
          comparison = a.jackpotWinners - b.jackpotWinners;
        }
        return sortOrder === 'desc' ? -comparison : comparison;
      });
  }, [games, sortBy, sortOrder]);

  const maxWinnersOverall = useMemo(() => {
    return Math.max(...winnersList.map((g) => g.jackpotWinners), 0);
  }, [winnersList]);

  const maxPrizeOverall = useMemo(() => {
    return Math.max(...winnersList.map((g) => g.jackpotPrize), 0);
  }, [winnersList]);

  const totalPages = Math.ceil(winnersList.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedWinners = winnersList.slice(startIndex, startIndex + pageSize);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  if (!games.length) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ListIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{winnersList.length} jogos acertaram a sena</p>
            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
              {statsMeta?.totalJackpotWinners.toLocaleString('pt-BR')} pessoas levaram o prêmio
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mr-1">Ordenar por:</span>
          {[
            { id: 'id', label: 'Concurso' },
            { id: 'prize', label: 'Prêmio' },
            { id: 'winners', label: 'Ganhadores' },
          ].map((field) => (
            <button
              key={field.id}
              onClick={() => toggleSort(field.id as SortField)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                ${sortBy === field.id
                  ? 'bg-primary text-primary-foreground shadow-glow-gold/20'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/5'}
              `}
            >
              {field.label}
              {sortBy === field.id && (
                sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>


      </div>

      {/* List with Inner Scroll and Height Limit */}
      <div className="relative border border-white/5 bg-black/20 overflow-hidden">
        <div className="max-h-[700px] overflow-y-auto custom-scrollbar p-4">
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPage}-${pageSize}-${sortBy}-${sortOrder}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {paginatedWinners.map((game, index) => (
                  <JackpotWinnerRow
                    key={game.id}
                    game={game}
                    index={index}
                    maxWinners={maxWinnersOverall}
                    maxPrize={maxPrizeOverall}
                  />
                ))}
              </motion.div>

            </AnimatePresence>
          </div>
        </div>

        {/* Scroll Indicator Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Simple Footer Pagination for accessibility */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
