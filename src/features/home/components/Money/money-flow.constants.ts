import { REVENUE_ALLOCATION } from '@/domain/lottery/lottery.constants';

export const getRevenueDistributionData = (isOnline: boolean = false) => {
  const comissaoLotericos = isOnline 
    ? (REVENUE_ALLOCATION.OPERATIONAL_ONLINE_COMMISSION * 100) 
    : (REVENUE_ALLOCATION.OPERATIONAL_COMMISSION * 100);
    
  const comissaoDiff = (REVENUE_ALLOCATION.OPERATIONAL_COMMISSION - REVENUE_ALLOCATION.OPERATIONAL_ONLINE_COMMISSION) * 100;
  
  const custeioOperacional = isOnline 
    ? ((REVENUE_ALLOCATION.OPERATIONAL_CUSTEIO * 100) + comissaoDiff) 
    : (REVENUE_ALLOCATION.OPERATIONAL_CUSTEIO * 100);

  return [
    { name: "Prêmio Bruto", value: Number((REVENUE_ALLOCATION.PRIZE_POOL * 100).toFixed(2)), color: "hsl(142, 71%, 45%)" },
    { name: "Seguridade Social", value: Number((REVENUE_ALLOCATION.SOCIAL_SECURITY * 100).toFixed(2)), color: "hsl(217, 91%, 60%)" },
    { name: "Custeio de despesas operacionais", value: Number(custeioOperacional.toFixed(2)), color: "hsl(215, 16%, 47%)" },
    { name: "Comissão dos lotéricos *", value: Number(comissaoLotericos.toFixed(2)), color: "hsl(215, 20%, 55%)" },
    { name: "Fundo Nacional de Segurança Pública - FNSP", value: Number((REVENUE_ALLOCATION.PUBLIC_SECURITY * 100).toFixed(2)), color: "hsl(0, 84%, 60%)" },
    { name: "Fundo Penitenciário Nacional - FUNPEN", value: Number((REVENUE_ALLOCATION.PENITENTIARY * 100).toFixed(2)), color: "hsl(280, 65%, 60%)" },
    { name: "Fundo Nacional da Cultura - FNC", value: Number((REVENUE_ALLOCATION.CULTURE * 100).toFixed(2)), color: "hsl(190, 90%, 50%)" },
    { name: "Ministério do Esporte", value: Number((REVENUE_ALLOCATION.SPORT * 100).toFixed(2)), color: "hsl(150, 60%, 50%)" },
    { name: "Comitê Olímpico do Brasil - COB", value: Number((REVENUE_ALLOCATION.COB * 100).toFixed(2)), color: "hsl(38, 92%, 50%)" },
    { name: "Secretarias de esporte, ou órgãos equivalentes, dos Estados e do Distrito Federal", value: Number((REVENUE_ALLOCATION.STATE_SPORTS * 100).toFixed(2)), color: "hsl(38, 80%, 60%)" },
    { name: "Comitê Paralímpico Brasileiro - CPB", value: Number((REVENUE_ALLOCATION.CPB * 100).toFixed(2)), color: "hsl(38, 70%, 55%)" },
    { name: "Fundo de Desenvolvimento de Loterias - FDL", value: Number((REVENUE_ALLOCATION.OPERATIONAL_FDL * 100).toFixed(2)), color: "hsl(215, 25%, 65%)" },
    { name: "Comitê Brasileiro de Clubes - CBC", value: Number((REVENUE_ALLOCATION.CBC * 100).toFixed(2)), color: "hsl(38, 60%, 45%)" },
    { name: "Confederação Brasileira do Desporto Escolar - CBDE", value: Number((REVENUE_ALLOCATION.CBDE * 100).toFixed(2)), color: "hsl(38, 50%, 40%)" },
    { name: "Confederação Brasileira do Desporto Universitário - CBDU", value: Number((REVENUE_ALLOCATION.CBDU * 100).toFixed(2)), color: "hsl(38, 40%, 35%)" },
    { name: "Comitê Brasileiro de Clubes Paralímpicos - CBCP", value: Number((REVENUE_ALLOCATION.CBCP * 100).toFixed(2)), color: "hsl(38, 30%, 30%)" },
    { name: "Fenaclubes", value: Number((REVENUE_ALLOCATION.FENACLUBES * 100).toFixed(2)), color: "hsl(215, 10%, 40%)" },
  ];
};
