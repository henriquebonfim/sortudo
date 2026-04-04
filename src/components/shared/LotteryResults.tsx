import { Draw, SearchResult } from '@/domain/lottery/draw';
import { formatCurrency, formatNumber } from '@/lib';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown, Search, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { MiniBall } from './MiniBall';

export function JackpotDetails({ draw }: { draw: Draw }) {
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
          Sorteio #{draw.id}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-3xl font-display font-bold text-foreground">
          {formatCurrency(draw.jackpotPrize)}
        </span>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            {new Date(draw.date).toLocaleDateString('pt-BR')}
          </div>
          {draw.jackpotWinners === 0 ? (
            <div className="flex items-center gap-1.5 text-yellow-500">
              <Users className="w-3.5 h-3.5 opacity-70" />
              Acumulado
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-green-500">
              <Users className="w-3.5 h-3.5 opacity-70" />
              {draw.jackpotWinners} {draw.jackpotWinners === 1 ? 'ganhador' : 'ganhadores'}
            </div>
          )}
        </div>
      </div>

      {draw.locations.length > 0 && (
        <div className="pt-3 border-t border-primary/10 mt-1">
          <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-bold mb-2 opacity-60">
            Cidades contempladas:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {draw.locations.map((loc, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 text-[10px] font-bold text-primary border border-primary/20">
                {loc}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Table showing draws with partial matches (Quina, Quadra, etc.).
 */
export function MatchesTable({ result }: { result: SearchResult }) {
  const groups = [
    { label: 'Sena', hits: 6, data: result.jackpot, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
    { label: 'Quina', hits: 5, data: result.fiveHits, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
    { label: 'Quadra', hits: 4, data: result.fourHits, color: 'text-blue-500', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
    { label: 'Terno', hits: 3, data: result.threeHits, color: 'text-slate-400', bg: 'bg-slate-400/5', border: 'border-slate-400/20' },
  ].filter(g => g.data.length > 0);

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
          <MatchGroup key={group.label} group={group} />
        ))}
      </div>
    </div>
  );
}

function MatchGroup({ group }: { group: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`overflow-hidden rounded-2xl border ${group.border} bg-black/20 backdrop-blur-md transition-all duration-300`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/5 active:bg-white/10"
      >
        <div className="flex items-center gap-4">
          <div className={`w-2 h-2 rounded-full ${group.bg.replace('/5', '/40')} shadow-[0_0_8px_currentColor] ${group.color}`} />
          <span className={`text-sm font-bold tracking-wide ${group.color}`}>
            {group.label}
          </span>
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
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">Sorteio</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5">Data</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 text-right">Prêmio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {group.data.map((d: any) => (
                      <tr key={d.id} className="hover:bg-white/5 transition-all duration-150 group/row">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-foreground group-hover/row:text-primary">
                          #{d.id}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-medium">
                          {new Date(d.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-foreground tabular-nums text-right">
                          {formatCurrency(
                            group.hits === 6 ? d.jackpotPrize :
                              group.hits === 5 ? d.quinaPrize :
                                group.hits === 4 ? d.quadraPrize : 0
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

/**
 * Summary banner for search results.
 */
export function ResultBanner({ result }: { result: SearchResult }) {
  const hasJackpot = result.jackpot.length > 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-10 rounded-[40px] border text-center transition-all duration-700 shadow-3xl ${hasJackpot
          ? 'bg-primary/10 border-primary/30 shadow-glow-gold/20'
          : 'bg-white/5 border-white/10'
          }`}
      >
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 tracking-tight">
          {hasJackpot
            ? 'Combinação já foi Premiada!'
            : 'Combinação nunca foi sorteada!'}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
          {hasJackpot
            ? `Este exato conjunto de dezenas foi sorteado ${result.jackpot.length} ${result.jackpot.length === 1 ? 'vez' : 'vezes'} entre os ${formatNumber(result.totalAnalyzed)} concursos oficiais da Mega-Sena.`
            : `Esta combinação nunca saiu para o prêmio máximo. É um resultado encorajador? Nenhuma combinação de 6 números se repetiu até hoje na história.`}
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {result.combination.map(n => (
            <MiniBall key={n} number={n} />
          ))}
        </div>
      </motion.div>

      {hasJackpot && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.jackpot.map(d => (
            <JackpotDetails key={d.id} draw={d} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Search input form.
 */
function NumberInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: boolean }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={2}
      value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, "");
        if (v === "" || (Number(v) >= 1 && Number(v) <= 60)) onChange(v);
      }}
      placeholder="?"
      className={[
        "h-14 w-14 rounded-full border-2 bg-card text-center",
        "font-mono text-lg font-semibold text-foreground",
        "outline-none transition-all tabular-nums placeholder:text-muted-foreground/30",
        "sm:h-16 sm:w-16 sm:text-xl",
        error
          ? "border-hot shadow-[0_0_12px_hsl(var(--hot)/0.3)]"
          : value
            ? "border-primary shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
            : "border-border focus:border-primary",
      ].join(" ")}
    />
  );
}

export function SearchForm({ inputs, onChange, hasDuplicates, isValid, onSearch, drawCount }: {
  inputs: string[];
  onChange: (idx: number, val: string) => void;
  hasDuplicates: boolean;
  isValid: boolean;
  onSearch: () => void;
  drawCount: number;
}) {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-10">
      <div className="glass-card p-8 md:p-12 w-full rounded-[32px] border-primary/10 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 font-bold text-center mb-8">
          ESCOLHA 6 NÚMEROS (1–60)
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {inputs.map((val, idx) => (
            <NumberInput
              key={idx}
              value={val}
              onChange={(v) => onChange(idx, v)}
              error={val !== '' && inputs.filter((x) => x === val && x !== '').length > 1}
            />
          ))}
        </div>

        {hasDuplicates && (
          <p className="mt-8 text-center text-sm font-bold text-hot tracking-wide animate-bounce">
            Números repetidos não são permitidos.
          </p>
        )}
      </div>

      <button
        onClick={onSearch}
        disabled={!isValid}
        className="btn-generate cursor-pointer w-72 h-16 flex items-center justify-center gap-3 transition-all active:scale-95 group"
      >
        <Search className="w-4 h-4  group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        Buscar
      </button>
    </div>
  );
}

/**
 * WhatsApp share button.
 */
export function ShareButton({ result }: { result: SearchResult }) {
  const handleShare = () => {
    const nums = result.combination.join(' ');
    const hasJackpot = result.jackpot.length > 0;
    const msg = `Busquei minha combinação [${nums}] no Sortudo. De ${result.totalAnalyzed.toLocaleString('pt-BR')} sorteios, esse número ${hasJackpot ? `saiu ${result.jackpot.length > 1 ? 'várias vezes' : 'uma vez'}!` : 'nunca saiu.'}\nConfira: ${window.location.origin}/buscar/${result.combination.join('-')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <button
      onClick={handleShare}
      className="btn-share cursor-pointer flex items-center gap-3 px-6 py-3 rounded-2xl bg-success/10 border border-success/20 text-success font-bold text-sm hover:bg-success/20 transition-all active:scale-95"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.2 17.6 4.29 1.648 6.072L0 24l6.093-1.598A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.001-1.37l-.359-.214-3.717.975.993-3.63-.234-.374A9.786 9.786 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
      </svg>
      Compartilhar no WhatsApp
    </button>
  );
}
