export const PROB_SENA = 1 / 50_063_860;
export const PROB_QUINA = 1 / 154_518;
export const PROB_QUADRA = 1 / 2_332;

export const TICKET_PRICE = 6.0;
export const TOTAL_COMBINATIONS = 50_063_860;

// Revenue allocation (where the money goes)
export const REVENUE_ALLOCATION = {
  PRIZE_POOL: 0.4379,
  SOCIAL_SECURITY: 0.1732,
  OPERATIONAL: 0.1913,
  PUBLIC_SECURITY: 0.0680,
  PENITENTIARY: 0.03,
  CULTURE: 0.0291,
  SPORT: 0.0249,
  OTHER: 0.0456, // Combined committees and others
};

export const MEGA_DA_VIRADA_THRESHOLD = 50_000_000;
export const MEGA_DA_VIRADA_START_YEAR = 2009;
export const DECEMBER_MONTH = '-12-';

export const LOW_HIGH_BOUNDARY = 30;
export const MAX_LOTTERY_NUMBER = 60;
export const BALLS_PER_DRAW = 6;
export const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];

export const CHART_COLORS = {
  AMBER: "#F59E0B",
  BLUE: "#3B82F6",
  EMERALD: "#10B981",
  SLATE: "#94A3B8",
  RED: "#EF4444",
  VIOLET: "#8B5CF6",
  PRIMARY: "hsl(var(--primary))",
  MUTED: "hsl(var(--muted))",
  TICK_LABEL: "#94A3B8",
  GRID_STROKE: "rgba(255,255,255,0.05)",
};

export const CHART_DIMENSIONS = {
  DEFAULT_HEIGHT: 320,
  SMALL_HEIGHT: 240,
  MARGIN: { top: 16, right: 16, bottom: 4, left: 0 },
};
