import {
  PROB_SENA,
  PROB_QUINA,
  PROB_QUADRA,
  AVG_SENA_PRIZE,
  AVG_QUINA_PRIZE,
  AVG_QUADRA_PRIZE,
  TICKET_PRICE,
} from "@/core/constants/lottery";

export interface SimulationParams {
  years: number;
  betsPerWeek: number;
  ticketPrice: number;
}

export interface SimulationEvent {
  draw: number;
  balance: number;
  event: null | "quadra" | "quina" | "sena";
}

export interface SimulationResult {
  history: SimulationEvent[];
  totalSpent: number;
  totalWon: number;
  finalBalance: number;
  totalDraws: number;
  quadras: number;
  quinas: number;
  senas: number;
}

export function simulateLife(params: SimulationParams): SimulationResult {
  const { years, betsPerWeek, ticketPrice } = params;
  const totalDraws = years * 52 * betsPerWeek;
  let balance = 0;
  let totalWon = 0;
  let quadras = 0;
  let quinas = 0;
  let senas = 0;
  const history: SimulationEvent[] = [];
  const step = Math.max(1, Math.floor(totalDraws / 500));

  for (let i = 0; i < totalDraws; i++) {
    const roll = Math.random();
    balance -= ticketPrice;
    let event: SimulationEvent["event"] = null;

    if (roll < PROB_SENA) {
      balance += AVG_SENA_PRIZE;
      totalWon += AVG_SENA_PRIZE;
      senas++;
      event = "sena";
    } else if (roll < PROB_SENA + PROB_QUINA) {
      balance += AVG_QUINA_PRIZE;
      totalWon += AVG_QUINA_PRIZE;
      quinas++;
      event = "quina";
    } else if (roll < PROB_SENA + PROB_QUINA + PROB_QUADRA) {
      balance += AVG_QUADRA_PRIZE;
      totalWon += AVG_QUADRA_PRIZE;
      quadras++;
      event = "quadra";
    }

    if (i % step === 0 || event) {
      history.push({ draw: i, balance, event });
    }
  }

  return {
    history,
    totalSpent: totalDraws * ticketPrice,
    totalWon,
    finalBalance: balance,
    totalDraws,
    quadras,
    quinas,
    senas,
  };
}
