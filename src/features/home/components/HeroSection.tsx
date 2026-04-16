import { useAggregatedRevenue } from '@/hooks/use-home';
import { AnimatedCounter } from '@/shared/components/AnimatedCounter';
import { Button } from '@/shared/components/ui/Button';
import { spring } from '@/shared/utils';
import { motion } from 'framer-motion';
import { ArrowDown, BarChart3, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection({ id }: { id?: string }) {
  const {
    totalBillions,
    fractionBillions,
    drawCount,
    yearsOfOperation,
    totalJackpotWinners,
    totalPrizeDistributed,
  } = useAggregatedRevenue();

  return (
    <section
      id={id}
      className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden sm:min-h-[90vh]"
      aria-label="Introdução"
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid w-full grid-cols-1 justify-items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:justify-items-stretch lg:gap-x-16 lg:gap-y-8">
          {/* Left — headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.gentle}
            className="w-full max-w-2xl text-center lg:col-start-1 lg:row-start-1 lg:max-w-none lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-5 inline-block rounded-full border border-primary/25 bg-primary/8 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-primary sm:mb-6"
            >
              Dados educativos · Mega-Sena
            </motion.span>

            <h1 className="mb-4 text-balance font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:mb-5 md:text-6xl lg:text-7xl">
              A <span className="text-gradient-gold underline decoration-primary/40">sorte</span> é
              um <span className="text-gradient-gold">erro de cálculo</span>
            </h1>

            <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg lg:mx-0">
              Veja como a matemática revela a Mega-Sena, quanto os brasileiros já investiram e por
              que a casa sempre ganha.
            </p>
          </motion.div>

          {/* Right — stat card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, ...spring.standard }}
            className="w-full max-w-sm pt-1 sm:pt-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:pt-0"
          >
            <dl
              className="glass-card gold-glow relative overflow-hidden p-5 sm:p-6 md:p-8"
              aria-label="Arrecadação histórica da Mega-Sena"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, hsl(43 96% 56% / 0.04) 0%, transparent 60%)',
                }}
              />

              <dd className="mb-1 font-mono text-3xl font-bold leading-none tabular-nums text-primary sm:text-4xl md:text-5xl">
                R$&nbsp;
                <AnimatedCounter target={totalBillions} duration={2500} />,
                <AnimatedCounter
                  target={Number(fractionBillions.toFixed(2))}
                  duration={2800}
                />{' '}
                bilhões
              </dd>
              <dt className="stat-label mb-3 text-[11px] sm:text-xs md:text-sm">
                de Reais já foram arrecadados
              </dt>
              <dd className="mt-2 font-mono text-xs text-muted-foreground">
                {drawCount.toLocaleString('pt-BR')} sorteios ({yearsOfOperation} anos)
              </dd>

              <div className="my-5 h-px bg-border/50" />

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <p className="stat-label mb-1 text-[10px]">Total de Ganhadores (Sena)</p>
                  <p className="font-mono text-sm">{totalJackpotWinners.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="stat-label mb-1 text-[10px]">Total de Premiação distribuída</p>
                  <p className="font-mono text-sm font-semibold text-primary">
                    R${' '}
                    {(totalPrizeDistributed / 1_000_000_000).toLocaleString('pt-BR', {
                      maximumFractionDigits: 2,
                    })}{' '}
                    bi
                  </p>
                </div>
                <div>
                  <p className="stat-label mb-1 text-[10px]">Chance de ganhar com 6 números</p>
                  <p className="font-mono text-sm font-semibold text-hot">1 em 50M</p>
                </div>
              </div>
            </dl>
          </motion.div>

          {/* Actions — CTA then search */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, ...spring.standard }}
            className="w-full max-w-sm pt-3 sm:pt-4 lg:col-start-1 lg:row-start-2 lg:max-w-none lg:pt-0"
          >
            <div className="flex flex-col items-center gap-3 lg:items-start lg:justify-start">
              <Button
                id="hero-view-report"
                asChild
                size="lg"
                className="w-[250px] rounded-2xl border-none bg-transparent px-6 py-4 font-display text-sm font-bold text-primary hover:text-primary-foreground shadow-md transition-all hover:bg-primary/90 sm:px-8 sm:py-6 sm:text-base sm:shadow-lg"
              >
                <Link to="/dados">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analisar Relatório
                </Link>
              </Button>

              <Button
                id="hero-lookup-combination"
                asChild
                variant="outline"
                size="lg"
                className="w-[250px] cursor-pointer rounded-2xl border-border px-6 py-4 font-display text-sm font-semibold text-muted-foreground transition-all hover:border-primary hover:text-black sm:px-8 sm:py-6 sm:text-base"
              >
                <Link to="/buscar">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Combinação
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-16 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground/50 font-mono tracking-wider">
          explore alguns dados interessantes abaixo
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
