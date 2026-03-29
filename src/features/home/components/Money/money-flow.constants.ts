import { REVENUE_ALLOCATION } from '@/domain/lottery/lottery.constants';

export const getRevenueDistributionData = (isOnline: boolean = false) => {
  const comissaoLotericos = isOnline ? 4.00 : 8.61;
  const custeioOperacional = isOnline ? (9.57 + 4.61) : 9.57;

  return [
    { name: "Prêmio Bruto", value: Number((REVENUE_ALLOCATION.PRIZE_POOL * 100).toFixed(2)), color: "hsl(142, 71%, 45%)" },
    { name: "Seguridade Social", value: Number((REVENUE_ALLOCATION.SOCIAL_SECURITY * 100).toFixed(2)), color: "hsl(217, 91%, 60%)" },
    { name: "Custeio de despesas operacionais", value: custeioOperacional, color: "hsl(215, 16%, 47%)" },
    { name: "Comissão dos lotéricos *", value: comissaoLotericos, color: "hsl(215, 20%, 55%)" },
    { name: "Fundo Nacional de Segurança Pública - FNSP", value: Number((REVENUE_ALLOCATION.PUBLIC_SECURITY * 100).toFixed(2)), color: "hsl(0, 84%, 60%)" },
    { name: "Fundo Penitenciário Nacional - FUNPEN", value: Number((REVENUE_ALLOCATION.PENITENTIARY * 100).toFixed(2)), color: "hsl(280, 65%, 60%)" },
    { name: "Fundo Nacional da Cultura - FNC", value: Number((REVENUE_ALLOCATION.CULTURE * 100).toFixed(2)), color: "hsl(190, 90%, 50%)" },
    { name: "Ministério do Esporte", value: Number((REVENUE_ALLOCATION.SPORT * 100).toFixed(2)), color: "hsl(150, 60%, 50%)" },
    { name: "Comitê Olímpico do Brasil - COB", value: 1.73, color: "hsl(38, 92%, 50%)" },
    { name: "Secretarias de esporte, ou órgãos equivalentes, dos Estados e do Distrito Federal", value: 1.00, color: "hsl(38, 80%, 60%)" },
    { name: "Comitê Paralímpico Brasileiro - CPB", value: 0.96, color: "hsl(38, 70%, 55%)" },
    { name: "Fundo de Desenvolvimento de Loterias - FDL", value: 0.95, color: "hsl(215, 25%, 65%)" },
    { name: "Comitê Brasileiro de Clubes - CBC", value: 0.46, color: "hsl(38, 60%, 45%)" },
    { name: "Confederação Brasileira do Desporto Escolar - CBDE", value: 0.22, color: "hsl(38, 50%, 40%)" },
    { name: "Confederação Brasileira do Desporto Universitário - CBDU", value: 0.11, color: "hsl(38, 40%, 35%)" },
    { name: "Comitê Brasileiro de Clubes Paralímpicos - CBCP", value: 0.07, color: "hsl(38, 30%, 30%)" },
    { name: "Fenaclubes", value: 0.01, color: "hsl(215, 10%, 40%)" },
  ];
};
