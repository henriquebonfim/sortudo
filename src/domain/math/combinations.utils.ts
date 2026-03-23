import { combinations } from "./combinations";

export interface ComboEntry {
  n: number;
  combos: number;
  label: string;
}

export const getCombosTable = (start: number = 6, count: number = 15, choose: number = 6): ComboEntry[] => {
  return Array.from({ length: count }, (_, i) => {
    const n = i + start;
    return {
      n,
      combos: combinations(n, choose),
      label: `${n}`,
    };
  });
};
