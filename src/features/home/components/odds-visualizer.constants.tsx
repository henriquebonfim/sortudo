import { ReactNode } from 'react';
import { Target, Zap, AlertCircle, TrendingDown } from 'lucide-react';

export interface OddsEntry {
  id: string;
  title: string;
  probability: number;
  odds: string;
  icon: ReactNode;
  color: string;
  description: string;
}

export const ODDS_DATA: OddsEntry[] = [
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
