import type { Game } from '@/workers/core/types';

interface GameOverrides extends Partial<Game> {
  id: number;
  date: string;
  numbers: number[];
}

const BASE_GAME: Omit<Game, 'id' | 'date' | 'numbers'> = {
  jackpotWinners: 0,
  jackpotPrize: 0,
  quinaWinners: 0,
  quinaPrize: 0,
  quadraWinners: 0,
  quadraPrize: 0,
  accumulated: false,
  totalRevenue: 0,
  prizeEstimate: 0,
  locations: [],
};

export function makeGame(overrides: GameOverrides): Game {
  return { ...BASE_GAME, ...overrides };
}

export function makeAnalyticsSampleGames(): Game[] {
  return [
    makeGame({
      id: 1,
      date: '2022-01-01',
      numbers: [1, 2, 3, 4, 5, 6],
      jackpotWinners: 1,
      jackpotPrize: 1_000_000,
      quinaWinners: 10,
      quinaPrize: 10_000,
      quadraWinners: 100,
      quadraPrize: 1_000,
      totalRevenue: 10_000_000,
      locations: ['Sao Paulo/SP'],
    }),
    makeGame({
      id: 2,
      date: '2022-01-08',
      numbers: [1, 2, 7, 8, 9, 10],
      jackpotWinners: 0,
      jackpotPrize: 0,
      quinaWinners: 20,
      quinaPrize: 5_000,
      quadraWinners: 200,
      quadraPrize: 500,
      accumulated: true,
      totalRevenue: 12_000_000,
      locations: [],
    }),
    makeGame({
      id: 3,
      date: '2023-01-01',
      numbers: [11, 12, 13, 14, 15, 16],
      jackpotWinners: 2,
      jackpotPrize: 2_000_000,
      quinaWinners: 30,
      quinaPrize: 4_000,
      quadraWinners: 300,
      quadraPrize: 400,
      totalRevenue: 20_000_000,
      locations: ['Rio de Janeiro/RJ'],
    }),
  ];
}
