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
      className="container min-h-[100vh] flex flex-col items-center justify-center overflow-hidden"
      aria-label="Introdução"
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left — headline + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.gentle}
            className="flex-1 text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-xs font-mono text-primary tracking-widest uppercase mb-6 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/8"
            >
              Dados educativos · Mega-Sena
            </motion.span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-balance text-foreground leading-[1.05] mb-6">
              A <span className="text-gradient-gold underline decoration-primary/40">sorte</span> é
              um <span className="text-gradient-gold">erro de cálculo</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
              Veja como a matemática revela a Mega-Sena, quanto os brasileiros já investiram e por
              que a casa sempre ganha.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Button
                id="hero-view-report"
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-base px-8 py-6 rounded-2xl shadow-lg transition-all border-none w-full sm:w-auto"
              >
                <Link to="/dados">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Ver Relatório Completo
                </Link>
              </Button>

              <Button
                id="hero-lookup-combination"
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:border-primary hover:text-black text-muted-foreground font-display font-semibold text-base px-8 py-6 rounded-2xl transition-all w-full sm:w-auto cursor-pointer"
              >
                <Link to="/buscar">
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Combinação
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right — stat card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, ...spring.standard }}
            className="flex-shrink-0 w-full max-w-sm"
          >
            <dl
              className="glass-card p-6 md:p-8 gold-glow relative overflow-hidden"
              aria-label="Arrecadação histórica da Mega-Sena"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, hsl(43 96% 56% / 0.04) 0%, transparent 60%)',
                }}
              />

              <dt className="stat-label text-xs md:text-sm mb-3">Arrecadação histórica</dt>
              <dd className="text-4xl md:text-5xl font-mono font-bold text-primary tabular-nums leading-none mb-1">
                R$&nbsp;
                <AnimatedCounter target={totalBillions} duration={2500} />,
                <AnimatedCounter
                  target={Number(fractionBillions.toFixed(2))}
                  duration={2800}
                />{' '}
                bilhões
              </dd>
              <dd className="text-xs text-muted-foreground font-mono mt-2">
                {drawCount.toLocaleString('pt-BR')} sorteios ({yearsOfOperation} anos)
              </dd>

              <div className="my-5 h-px bg-border/50" />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="stat-label text-[10px] mb-1">Total de Ganhadores (Sena)</p>
                  <p className="font-mono text-sm">{totalJackpotWinners.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="stat-label text-[10px] mb-1">Total de Premiação distribuída</p>
                  <p className="font-mono font-semibold text-primary text-sm">
                    R${' '}
                    {(totalPrizeDistributed / 1_000_000_000).toLocaleString('pt-BR', {
                      maximumFractionDigits: 2,
                    })}{' '}
                    bi
                  </p>
                </div>
                <div>
                  <p className="stat-label text-[10px] mb-1">Chance de ganhar com 6 números</p>
                  <p className="font-mono font-semibold text-hot text-sm">1 em 50M</p>
                </div>
              </div>
            </dl>
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
          explore os dados históricos
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
