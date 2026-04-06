import { Game, SearchResult } from '@/lib/lottery/types';
import { formatCurrency, formatNumber } from '@/lib/lottery/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { MiniBall } from './MiniBall';
import { ShareButton } from './ShareButton';

function JackpotDetails({ game }: { game: Game }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-4 p-6 rounded-3xl bg-primary/5 border border-primary/20 shadow-glow-gold/10 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Sorteado!</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-primary/80 uppercase">
          Sorteio #{game.id}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-3xl font-display font-bold text-foreground">
          {formatCurrency(game.jackpotPrize)}
        </span>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            {new Date(game.date).toLocaleDateString('pt-BR')}
          </div>
          {game.jackpotWinners === 0 ? (
            <div className="flex items-center gap-1.5 text-yellow-500">
              <Users className="w-3.5 h-3.5 opacity-70" />
              Acumulado
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-green-500">
              <Users className="w-3.5 h-3.5 opacity-70" />
              {game.jackpotWinners} {game.jackpotWinners === 1 ? 'ganhador' : 'ganhadores'}
            </div>
          )}
        </div>
      </div>

      {game.locations.length > 0 && (
        <div className="pt-3 border-t border-primary/10 mt-1">
          <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-bold mb-2 opacity-60">
            Cidades contempladas:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {game.locations.map((loc, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-primary/10 text-[10px] font-bold text-primary border border-primary/20"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function MatchesTable({ result }: { result: SearchResult }) {
  const groups = [
    {
      label: 'Sena',
      hits: 6,
      data: result.jackpot,
      color: 'text-primary',
      bg: 'bg-primary/5',
      border: 'border-primary/20',
    },
    {
      label: 'Quina',
      hits: 5,
      data: result.fiveHits,
      color: 'text-amber-500',
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/20',
    },
    {
      label: 'Quadra',
      hits: 4,
      data: result.fourHits,
      color: 'text-blue-500',
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/20',
    },
    {
      label: 'Terno',
      hits: 3,
      data: result.threeHits,
      color: 'text-slate-400',
      bg: 'bg-slate-400/5',
      border: 'border-slate-400/20',
    },
  ].filter((g) => g.data.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between px-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Histórico de Acertos
        </h3>
      </div>

      <div className="space-y-3">
        {groups.map((group) => (
          <MatchGroup key={group.label} group={group} combination={result.combination} />
        ))}
      </div>
    </div>
  );
}

function MatchGroup({
  group,
  combination,
}: {
  group: { label: string; hits: number; data: Game[]; color: string; bg: string; border: string };
  combination: number[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${group.border} bg-black/20 backdrop-blur-md transition-all duration-300`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/5 active:bg-white/10"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-2 h-2 rounded-full ${group.bg.replace('/5', '/40')} shadow-[0_0_8px_currentColor] ${group.color}`}
          />
          <span className={`text-sm font-bold tracking-wide ${group.color}`}>{group.label}</span>
          <span className="text-[10px] font-mono font-bold text-muted-foreground/60 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            {group.data.length} {group.data.length === 1 ? 'vez' : 'vezes'}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-muted-foreground/40"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-6 pt-2">
              <div className="overflow-hidden rounded-xl border border-white/5">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                        Sorteio
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                        Data
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">
                        Jogo
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 text-right">
                        Prêmio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {group.data.map((g: Game) => (
                      <tr
                        key={g.id}
                        className="hover:bg-white/5 transition-all duration-150 group/row"
                      >
                        <td className="px-4 py-3 font-mono text-xs font-bold text-foreground group-hover/row:text-primary">
                          #{g.id}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-medium">
                          {new Date(g.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-medium flex flex-row gap-1.5 items-center">
                          {g.numbers.map((n) => (
                            <MiniBall
                              key={n}
                              number={n}
                              size="sm"
                              dimmed={!combination.includes(n)}
                            />
                          ))}
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-foreground tabular-nums text-right">
                          {formatCurrency(
                            group.hits === 6
                              ? g.jackpotPrize
                              : group.hits === 5
                                ? g.quinaPrize
                                : group.hits === 4
                                  ? g.quadraPrize
                                  : 0
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ResultBanner({ result }: { result: SearchResult }) {
  const hasJackpot = result.jackpot.length > 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-10 rounded-[40px] border text-center transition-all duration-700 shadow-3xl ${
          hasJackpot
            ? 'bg-primary/10 border-primary/30 shadow-glow-gold/20'
            : 'bg-white/5 border-white/10'
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 tracking-tight">
          {hasJackpot ? 'Combinação já foi Premiada!' : 'Combinação nunca foi sorteada!'}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
          {hasJackpot
            ? `Este exato conjunto de dezenas foi sorteado ${result.jackpot.length} ${result.jackpot.length === 1 ? 'vez' : 'vezes'} entre os ${formatNumber(result.totalAnalyzed)} concursos oficiais da Mega-Sena.`
            : `Esta combinação nunca saiu para o prêmio máximo. É um resultado encorajador? Nenhuma combinação de 6 números se repetiu até hoje na história.`}
        </p>

        <div className="flex flex-col items-center gap-8 mt-8">
          <div className="flex flex-wrap justify-center gap-4">
            {result.combination.map((n) => (
              <MiniBall key={n} number={n} />
            ))}
          </div>
          <ShareButton result={result} />
        </div>
      </motion.div>

      {hasJackpot && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.jackpot.map((g) => (
            <JackpotDetails key={g.id} game={g} />
          ))}
        </div>
      )}

      <MatchesTable result={result} />
    </div>
  );
}
