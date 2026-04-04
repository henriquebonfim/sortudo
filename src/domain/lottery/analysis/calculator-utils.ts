import { Draw } from '../data/draw';

export class CalculatorUtils {
  /** Returns a copy of draws sorted by ID in ascending order. */
  static sortDrawsById(draws: Draw[]): Draw[] {
    return [...draws].sort((a, b) => a.id - b.id);
  }

  /** Groups draws by year. */
  static groupByYear<T>(draws: Draw[], callback: (d: Draw) => T): Record<number, T[]> {
    const grouped: Record<number, T[]> = {};
    for (const d of draws) {
      const year = new Date(d.date).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(callback(d));
    }
    return grouped;
  }
}
