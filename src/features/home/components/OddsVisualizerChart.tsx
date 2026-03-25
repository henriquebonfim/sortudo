import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ODDS_DATA, OddsEntry } from './odds-visualizer.constants';
import { getVisualWidth } from './odds-visualizer.utils';

export function OddsVisualizerChart() {
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

      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-border/50">
        <p className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
          <span>
            <strong>O Viés do Otimismo:</strong> O cérebro humano tem dificuldade em processar números maiores que 10.000. Achamos que eventos de 1 em 1 milhão e 1 em 50 milhões são &quot;quase a mesma coisa&quot;, quando na verdade a diferença é monumental.
          </span>
        </p>
      </div>
    </div>
  );
}

interface OddsVisualizerCardProps {
  item: OddsEntry;
  index: number;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  visualWidth: number;
}

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
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full bg-secondary ${isMega ? 'bg-primary/20' : ''}`}>
            {item.icon}
          </div>
          <div>
            <h4 className={`font-medium ${isMega ? 'text-primary font-bold' : ''}`}>
              {item.title}
            </h4>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`text-sm font-mono ${
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
          Para visualizar a real proporção, a barra da Mega-Sena teria que ter o tamanho de um átomo comparada à barra do Raio.
        </p>
      )}
    </motion.div>
  );
}
