import { Game } from '@/lib/core/types';
import { MiniBall } from '@/shared/components/MiniBall';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatCurrency, formatDate } from '@/shared/utils';
import { useGames, useLotteryMeta } from '@/store/selectors';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ListIcon, MapPin, Trophy } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

type SortField = 'id' | 'prize' | 'winners';
type SortOrder = 'asc' | 'desc';

interface JackpotWinnerRowProps {
  game: Game;
  index: number;
  maxWinners: number;
  maxPrize: number;
}

const JackpotWinnerRow = memo(function JackpotWinnerRow({
  game,
  index,
  maxWinners,
  maxPrize,
}: JackpotWinnerRowProps) {
  const parsedDate = new Date(game.date);
  const hasValidDate = !Number.isNaN(parsedDate.getTime());
  const mobileDate = hasValidDate
    ? parsedDate
        .toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .toUpperCase()
    : formatDate(game.date).toUpperCase();
  const winnersLabel = `${game.jackpotWinners} ${game.jackpotWinners === 1 ? 'ganhador' : 'ganhadores'}`;
  const isRecord = game.jackpotPrize === maxPrize || game.jackpotWinners === maxWinners;
  const primaryLocation = game.locations[0] || 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: (index % 10) * 0.03 }}
      className="relative overflow-hidden"
    >
      <div className="relative overflow-hidden rounded-[22px] border border-white/10   p-4 md:hidden">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              <span className="text-amber-300">#{game.id}</span>
              <span className="mx-1.5 text-slate-500">/</span>
              {mobileDate}
            </p>

            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
              <Trophy className="h-3.5 w-3.5" />
              <span>Sena</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="font-display text-[clamp(1.2rem,5.3vw,1.75rem)] font-semibold leading-none text-slate-100">
              {winnersLabel}
            </p>
            <p className="font-display text-[clamp(1.2rem,5.8vw,1.95rem)] font-bold leading-tight text-slate-50">
              {formatCurrency(game.jackpotPrize)}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-amber-300/90 via-amber-500/40 to-transparent" />

          <div className="flex flex-wrap items-center gap-2">
            {game.numbers.map((num) => (
              <MiniBall key={`mobile-${game.id}-${num}`} number={num} size="sm" />
            ))}
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-slate-400">
            <MapPin className="h-3.5 w-3.5" />
            <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
              {primaryLocation}
            </span>
          </div>
        </div>

        {isRecord && (
          <span className="pointer-events-none absolute right-3 top-9 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-300">
            recorde
          </span>
        )}
      </div>

      <div className="relative hidden flex-col gap-4 rounded-2xl border border-border bg-muted/5 p-5 transition-all hover:bg-muted/10 md:flex">
        <div className="absolute inset-0 pointer-events-none opacity-20" />

        {/* Header: ID, Date, Winners */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="font-mono text-sm font-bold text-primary shadow-glow-gold/10">
                  #{game.id}
                </span>
                &nbsp;/ {formatDate(game.date)}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-foreground">
                  {winnersLabel}
                </span>
              </div>
              <p className="font-mono text-lg font-bold leading-none text-foreground">
                {formatCurrency(game.jackpotPrize)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="mb-1 flex items-center justify-end gap-1.5 text-primary">
              {isRecord && (
                <span className="ml-1 rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                  recorde
                </span>
              )}
              <Trophy className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Sena</span>
            </div>

            <div className="flex flex-col justify-between">
              <div className="relative z-10 flex min-w-52 flex-wrap gap-2 py-2">
                {game.numbers.map((num) => (
                  <MiniBall key={num} number={num} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        {game.locations.length > 0 && (
          <div className="relative z-10 border-t border-white/5 pt-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="flex flex-wrap gap-1.5">
                {game.locations.map((loc, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

export function AllJackpotWinnersList() {
  const games = useGames();
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
            <p className="text-sm font-bold text-foreground">
              {winnersList.length} jogos acertaram a sena
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
              {statsMeta?.totalJackpotWinners.toLocaleString('pt-BR')} pessoas levaram o prêmio
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mr-1">
            Ordenar por:
          </span>
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
                ${
                  sortBy === field.id
                    ? 'bg-primary text-primary-foreground shadow-glow-gold/20'
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/5'
                }
              `}
            >
              {field.label}
              {sortBy === field.id &&
                (sortOrder === 'desc' ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronUp className="w-3 h-3" />
                ))}
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
