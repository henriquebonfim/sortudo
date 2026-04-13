import { motion } from 'framer-motion';
import { AlertCircle, Target, TrendingDown, Zap } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface OddsEntry {
  id: string;
  title: string;
  probability: number;
  odds: string;
  icon: ReactNode;
  color: string;
  description: string;
}

interface OddsVisualizerCardProps {
  item: OddsEntry;
  index: number;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  visualWidth: number;
}

/**
 * Calculates a visual width multiplier using a logarithmic scale
 * to normalize vastly different probabilities (e.g., 1e-8 vs 1e-4) into a 1-100% range.
 */
const getVisualWidth = (probability: number): number => {
  const minProb = ODDS_DATA[0].probability;
  const maxProb = ODDS_DATA[1].probability;

  const logMin = Math.log10(minProb);
  const logMax = Math.log10(maxProb);
  const logProb = Math.log10(probability);

  const normalized = (logProb - logMin) / (logMax - logMin);

  return Math.max(1, normalized * 100);
};

const ODDS_DATA: OddsEntry[] = [
  {
    id: 'mega-sena',
    title: 'Ganhar na Mega-Sena',
    probability: 1 / 50063860,
    odds: '1 em 50.063.860',
    icon: <Target className="w-5 h-5 text-red-500" />,
    color: 'bg-red-500',
    description: 'Apostando 6 números',
  },
  {
    id: 'lightning',
    title: 'Ser atingido por um raio',
    probability: 1 / 15300,
    odds: '1 em 15.300',
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    color: 'bg-yellow-500',
    description: 'Em um determinado ano (EUA)',
  },
  {
    id: 'meteorite',
    title: 'Morrer por um meteorito',
    probability: 1 / 1600000,
    odds: '1 em 1.600.000',
    icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
    color: 'bg-orange-500',
    description: 'Ao longo da vida',
  },
  {
    id: 'shark',
    title: 'Ataque fatal de tubarão',
    probability: 1 / 3748067,
    odds: '1 em 3.748.067',
    icon: <TrendingDown className="w-5 h-5 text-blue-500" />,
    color: 'bg-blue-500',
    description: 'Ao longo da vida',
  },
];

function OddsVisualizerCard({
  item,
  index,
  hoveredId,
  onHover,
  visualWidth,
}: OddsVisualizerCardProps) {
  const isMega = item.id === 'mega-sena';
  const isHovered = hoveredId === item.id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg border transition-colors ${
        isHovered ? 'bg-secondary/50 border-primary/50' : 'bg-card border-border'
      } ${isMega ? 'border-primary/30 ring-1 ring-primary/20 bg-primary/5' : ''}`}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 sm:gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 shrink-0 rounded-full bg-secondary ${isMega ? 'bg-primary/20' : ''}`}
          >
            {item.icon}
          </div>
          <div>
            <h4 className={`font-medium leading-tight ${isMega ? 'text-primary font-bold' : ''}`}>
              {item.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.description}</p>
          </div>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto mt-1 sm:mt-0 ml-[44px] sm:ml-0">
          <span
            className={`text-sm font-mono block sm:inline ${
              isMega ? 'text-primary font-bold' : 'text-muted-foreground'
            }`}
          >
            {item.odds}
          </span>
        </div>
      </div>

      <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${visualWidth}%` }}
          transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
          className={`absolute top-0 left-0 h-full ${item.color} rounded-full`}
        />
      </div>

      {isMega && (
        <p className="text-xs text-center mt-3 text-muted-foreground italic">
          Para visualizar a real proporção, a barra da Mega-Sena teria que ter o tamanho de um átomo
          comparada à barra do Raio.
        </p>
      )}
    </motion.div>
  );
}

function OddsVisualizerChart() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">A Escala da Improbabilidade</h3>
        <p className="text-sm text-muted-foreground">
          Comparando a chance de ganhar na Mega-Sena com outros eventos raros.
        </p>
      </div>

      <div className="space-y-4">
        {ODDS_DATA.map((item, index) => {
          const isMega = item.id === 'mega-sena';
          const visualWidth = isMega ? 1 : getVisualWidth(item.probability);

          return (
            <OddsVisualizerCard
              key={item.id}
              item={item}
              index={index}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              visualWidth={visualWidth}
            />
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-border">
        <p className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
          <span>
            <strong>O Viés do Otimismo:</strong> O cérebro humano tem dificuldade em processar
            números maiores que 10.000. Achamos que eventos de 1 em 1 milhão e 1 em 50 milhões são
            &quot;quase a mesma coisa&quot;, quando na verdade a diferença é monumental.
          </span>
        </p>
      </div>
    </div>
  );
}

export function OddsStorySection({ id }: { id: string }) {
  return (
    <section id={id} className="container max-w-6xl mx-auto ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 rounded-3xl mb-6 ring-1 ring-rose-500/20">
          <Target className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight">
          A <span className="text-gradient-gold">Ilusão</span> da Escala
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          O cérebro não foi feito para entender o que é{' '}
          <span className="text-foreground font-bold underline decoration-rose-500/30">
            1 em 50.063.860
          </span>
          . Nosso cérebro confunde{' '}
          <span className="text-foreground text-rose-500 font-bold underline decoration-rose-500/30">
            altamente improvável
          </span>{' '}
          com{' '}
          <span className="text-foreground text-yellow-500 font-bold underline decoration-rose-500/30">
            apenas difícil
          </span>
          .
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="bg-card/50 backdrop-blur-sm border border-border rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-3xl rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full -ml-48 -mb-48 pointer-events-none" />

        <OddsVisualizerChart />

        <div className="mt-12 flex flex-col items-center border-t border-border pt-10">
          <p className="text-center text-muted-foreground mb-8 max-w-2xl text-base md:text-lg leading-relaxed">
            Cada bilhete jogado é{' '}
            <span className="text-rose-400 font-mono">matematicamente irrelevante</span> perante a
            imensa <span className="text-foreground font-bold">certeza estatística</span> construída
            contra o apostador.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
