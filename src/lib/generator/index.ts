import { BALLS_PER_DRAW, MAX_LOTTERY_NUMBER, PRIMES } from "@/shared/constants";
import { Game } from "@/shared/types";
import { GenerationMode } from "@/store/generator";

interface GenerationContext {
  hotNumbers: number[];
  coldNumbers: number[];
  games: Game[];
}
type GeneratorStrategy = (ctx: GenerationContext) => number[];
const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55];
const DATES_POOL = Array.from({ length: 31 }, (_, i) => i + 1);
const FULL_POOL = Array.from({ length: MAX_LOTTERY_NUMBER }, (_, i) => i + 1);
const ODDS_POOL = Array.from({ length: 30 }, (_, i) => i * 2 + 1);
const EVENS_POOL = Array.from({ length: 30 }, (_, i) => i * 2 + 2);


function pickRandom(
  pool: number[],
  count: number,
  maxRange: number,
  fallbackPool?: number[]
): number[] {
  let uniquePool = Array.from(new Set(pool)).filter((n) => n >= 1 && n <= maxRange);

  if (uniquePool.length < count && fallbackPool) {
    const fallbackSet = new Set(fallbackPool);
    uniquePool.forEach((num) => fallbackSet.delete(num));
    const needed = count - uniquePool.length;
    const additional = pickRandom(Array.from(fallbackSet), needed, maxRange);
    uniquePool = [...uniquePool, ...additional];
  }

  if (uniquePool.length <= count) return [...uniquePool].sort((a, b) => a - b);

  const shuffled = [...uniquePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).sort((a, b) => a - b);
}

const generateByParitySplit = (oddCount: number, evenCount: number) =>
  [
    ...pickRandom(ODDS_POOL, oddCount, MAX_LOTTERY_NUMBER),
    ...pickRandom(EVENS_POOL, evenCount, MAX_LOTTERY_NUMBER),
  ].sort((a, b) => a - b);



const STRATEGIES: Record<GenerationMode, GeneratorStrategy> = {
  random: () => pickRandom(FULL_POOL, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER),
  hot: (ctx) => pickRandom(ctx.hotNumbers, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER, FULL_POOL),
  cold: (ctx) => pickRandom(ctx.coldNumbers, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER, FULL_POOL),
  dates: () => pickRandom(DATES_POOL, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER),
  primes: () => pickRandom(PRIMES, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER),
  fibonacci: () => pickRandom(FIBONACCI, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER),
  winners: (ctx) => {
    if (ctx.games.length === 0) return pickRandom(FULL_POOL, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER);
    const game = ctx.games[Math.floor(Math.random() * ctx.games.length)];
    return pickRandom(game.numbers, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER, FULL_POOL);
  },
  '0odds-6evens': () => pickRandom(EVENS_POOL, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER),
  '1odd-5evens': () => generateByParitySplit(1, 5),
  '2odds-4evens': () => generateByParitySplit(2, 4),
  '3odds-3evens': () => generateByParitySplit(3, 3),
  '4odds-2evens': () => generateByParitySplit(4, 2),
  '5odds-1even': () => generateByParitySplit(5, 1),
  '6odds-0evens': () => pickRandom(ODDS_POOL, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER),
};

export class NumberGenerator {
  static generate(mode: GenerationMode | string, ctx: GenerationContext): number[] {
    const strategy = STRATEGIES[mode as GenerationMode] || STRATEGIES.random;
    const result = strategy(ctx);

    if (result.length === BALLS_PER_DRAW && new Set(result).size === BALLS_PER_DRAW) {
      return result;
    }

    return pickRandom(result, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER, FULL_POOL);
  }

  static generateRandomSequence(count: number): number[] {
    return pickRandom(FULL_POOL, count, MAX_LOTTERY_NUMBER);
  }
}
