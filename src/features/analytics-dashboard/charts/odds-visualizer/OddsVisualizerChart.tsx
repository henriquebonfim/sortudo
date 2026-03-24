import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, AlertCircle, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ODDS_DATA = [
  {
    id: 'mega-sena',
    title: 'Ganhar na Mega-Sena',
    probability: 1 / 50063860,
    odds: '1 em 50.063.860',
    icon: <Target className="w-5 h-5 text-green-500" />,
    color: 'bg-green-500',
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

export function OddsVisualizerChart() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Calcula um multiplicador para tornar as barras visíveis, já que as probabilidades são minúsculas.
  // Usamos logaritmo para comprimir a escala e permitir comparação visual.
  const getVisualWidth = (probability: number) => {
      // Mega-Sena é a menor probabilidade (~1.99e-8)
      // Raio é a maior (~6.5e-5)
      // Vamos mapear de forma que a Mega-Sena seja 1% e o raio seja 100%
      const minProb = ODDS_DATA[0].probability;
      const maxProb = ODDS_DATA[1].probability;

      const logMin = Math.log10(minProb);
      const logMax = Math.log10(maxProb);
      const logProb = Math.log10(probability);

      const normalized = (logProb - logMin) / (logMax - logMin);

      // Mapeia para 1% a 100%
      return Math.max(1, normalized * 100);
  };


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
          const visualWidth = isMega ? 1 : getVisualWidth(item.probability); // Mega-sena forced to 1% for effect

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-colors ${
                hoveredId === item.id ? 'bg-secondary/50 border-primary/50' : 'bg-card border-border'
              } ${isMega ? 'border-primary/30 ring-1 ring-primary/20 bg-primary/5' : ''}`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
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
                  <span className={`text-sm font-mono ${isMega ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    {item.odds}
                  </span>
                </div>
              </div>

              <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${visualWidth}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
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
        })}
      </div>

       <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-border/50">
        <p className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
          <span>
            <strong>O Viés do Otimismo:</strong> O cérebro humano tem dificuldade em processar números maiores que 10.000. Achamos que eventos de 1 em 1 milhão e 1 em 50 milhões são "quase a mesma coisa", quando na verdade a diferença é monumental.
          </span>
        </p>
      </div>
    </div>
  );
}
