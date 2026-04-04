import type { Draw } from '@/domain/lottery/draw';
import { MAX_LOTTERY_NUMBER, PRIMES } from '@/domain/lottery/lottery.constants';

// Re-exported here so the domain owns the type definition.
// The feature layer imports Mode from here (or from generator.types.ts — both are valid).
export type GenerationMode =
  | 'random'
  | 'hot'
  | 'cold'
  | 'sequential'
  | 'dates'
  | 'primes'
  | 'fibonacci'
  | 'winners'
  | '0odds-6evens'
  | '1odd-5evens'
  | '2odds-4evens'
  | '3odds-3evens'
  | '4odds-2evens'
  | '5odds-1even'
  | '6odds-0evens';

export interface GenerationContext {
  hotNumbers: number[];
  coldNumbers: number[];
  draws: Draw[];
}

type GeneratorStrategy = (ctx: GenerationContext) => number[];

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55];
const DATES_POOL = Array.from({ length: 31 }, (_, i) => i + 1);
const FULL_POOL = Array.from({ length: MAX_LOTTERY_NUMBER }, (_, i) => i + 1);
const ODDS_POOL = Array.from({ length: 30 }, (_, i) => i * 2 + 1);
const EVENS_POOL = Array.from({ length: 30 }, (_, i) => i * 2 + 2);

function pickRandom(pool: number[], count: number, fallbackPool?: number[]): number[] {
  let uniquePool = Array.from(new Set(pool)).filter(n => n >= 1 && n <= MAX_LOTTERY_NUMBER);
  
  // If pool is insufficient, mix with fallback (usually FULL_POOL)
  if (uniquePool.length < count && fallbackPool) {
    const fallbackSet = new Set(fallbackPool);
    uniquePool.forEach(num => fallbackSet.delete(num));
    const needed = count - uniquePool.length;
    const additional = pickRandom(Array.from(fallbackSet), needed);
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

const STRATEGIES: Record<GenerationMode, GeneratorStrategy> = {
  random: () => pickRandom(FULL_POOL, 6),
  hot: (ctx) => pickRandom(ctx.hotNumbers, 6, FULL_POOL),
  cold: (ctx) => pickRandom(ctx.coldNumbers, 6, FULL_POOL),
  sequential: () => [1, 2, 3, 4, 5, 6],
  dates: () => pickRandom(DATES_POOL, 6),
  primes: () => pickRandom(PRIMES, 6),
  fibonacci: () => pickRandom(FIBONACCI, 6),
  winners: (ctx) => {
    if (ctx.draws.length === 0) return pickRandom(FULL_POOL, 6);
    const draw = ctx.draws[Math.floor(Math.random() * ctx.draws.length)];
    return pickRandom(draw.numbers, 6, FULL_POOL);
  },
  '0odds-6evens': () => pickRandom(EVENS_POOL, 6),
  '1odd-5evens': () => [...pickRandom(ODDS_POOL, 1), ...pickRandom(EVENS_POOL, 5)].sort((a, b) => a - b),
  '2odds-4evens': () => [...pickRandom(ODDS_POOL, 2), ...pickRandom(EVENS_POOL, 4)].sort((a, b) => a - b),
  '3odds-3evens': () => [...pickRandom(ODDS_POOL, 3), ...pickRandom(EVENS_POOL, 3)].sort((a, b) => a - b),
  '4odds-2evens': () => [...pickRandom(ODDS_POOL, 4), ...pickRandom(EVENS_POOL, 2)].sort((a, b) => a - b),
  '5odds-1even': () => [...pickRandom(ODDS_POOL, 5), ...pickRandom(EVENS_POOL, 1)].sort((a, b) => a - b),
  '6odds-0evens': () => pickRandom(ODDS_POOL, 6),
};

/**
 * Pure domain service for generating lottery number combinations.
 * Uses a strategy pattern for different generation modes.
 */
export class NumberGenerator {
  static generate(mode: GenerationMode, ctx: GenerationContext): number[] {
    const strategy = STRATEGIES[mode] || STRATEGIES.random;
    const result = strategy(ctx);
    
    // Safety belt: Even if a strategy is buggy, domain guarantees 6 unique numbers
    if (result.length === 6 && new Set(result).size === 6) {
      return result;
    }
    
    return pickRandom(result, 6, FULL_POOL);
  }
}
