import { REVENUE_ALLOCATION } from '@/domain/lottery/lottery.constants';

export interface RevenueFlowItem {
  name: string;
  value: number;
  color: string;
}

export class RevenueService {
  static getFlowData(): RevenueFlowItem[] {
    return [
      { name: "Prêmios (Pool)", value: Math.round(REVENUE_ALLOCATION.PRIZE_POOL * 100), color: "hsl(142, 71%, 45%)" },
      { name: "Seguridade Social", value: Math.round(REVENUE_ALLOCATION.SOCIAL_SECURITY * 100), color: "hsl(217, 91%, 60%)" },
      { name: "Operacional / Comissões", value: Math.round(REVENUE_ALLOCATION.OPERATIONAL * 100), color: "hsl(215, 16%, 47%)" },
      { name: "Governo (Seguranca/Cultura/Esporte)", value: Math.round((REVENUE_ALLOCATION.PUBLIC_SECURITY + REVENUE_ALLOCATION.PENITENTIARY + REVENUE_ALLOCATION.CULTURE + REVENUE_ALLOCATION.SPORT + REVENUE_ALLOCATION.OTHER) * 100), color: "hsl(38, 92%, 50%)" },
    ];
  }

  static getFullBreakdown(): RevenueFlowItem[] {
    return [
      { name: "Prêmios", value: REVENUE_ALLOCATION.PRIZE_POOL * 100, color: "hsl(142 71% 45%)" },
      { name: "Seguridade Social", value: REVENUE_ALLOCATION.SOCIAL_SECURITY * 100, color: "hsl(38 92% 50%)" },
      { name: "Operacional", value: REVENUE_ALLOCATION.OPERATIONAL * 100, color: "hsl(215 16% 47%)" },
      { name: "Segurança Pública", value: REVENUE_ALLOCATION.PUBLIC_SECURITY * 100, color: "hsl(0 84% 60%)" },
      { name: "Penitenciário", value: REVENUE_ALLOCATION.PENITENTIARY * 100, color: "hsl(280 65% 60%)" },
      { name: "Cultura", value: REVENUE_ALLOCATION.CULTURE * 100, color: "hsl(190 90% 50%)" },
      { name: "Esporte", value: REVENUE_ALLOCATION.SPORT * 100, color: "hsl(217 91% 60%)" },
      { name: "Outros", value: REVENUE_ALLOCATION.OTHER * 100, color: "hsl(215 16% 47%)" },
    ];
  }

  static calculateExpectedReturn(betAmount: number) {
    const prizeReturn = REVENUE_ALLOCATION.PRIZE_POOL;
    const expectedValue = betAmount * prizeReturn;
    const loss = betAmount - expectedValue;
    const percentageLoss = (loss / betAmount) * 100;

    return {
      betAmount,
      expectedValue,
      loss,
      percentageLoss: Math.round(percentageLoss),
      returnPercentage: Math.round(prizeReturn * 100),
    };
  }
}
