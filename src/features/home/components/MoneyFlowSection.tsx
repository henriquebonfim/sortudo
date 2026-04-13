import { useLotteryMath } from '@/hooks/use-home';
import { Button } from '@/shared/components/ui/Button';
import { REVENUE_ALLOCATION } from '@/shared/constants';
import { formatCurrency, tooltipStyle } from '@/shared/utils';
import { motion } from 'framer-motion';
import { BarChart3, PiggyBank, Smartphone, Store } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

interface ExpectedStats {
  betAmount: number;
  returnPercentage: number;
  expectedValue: number;
  percentageLoss: number;
  loss: number;
}

interface MoneyFlowChartProps {
  distributionData: DistributionItem[];
  expectedStats: ExpectedStats;
}

interface DistributionItem {
  name: string;
  value: number;
  color: string;
}

const getRevenueDistributionData = (isOnline: boolean = false) => {
  const comissaoLotericos = isOnline
    ? REVENUE_ALLOCATION.OPERATIONAL_ONLINE_COMMISSION * 100
    : REVENUE_ALLOCATION.OPERATIONAL_COMMISSION * 100;

  const comissaoDiff =
    (REVENUE_ALLOCATION.OPERATIONAL_COMMISSION - REVENUE_ALLOCATION.OPERATIONAL_ONLINE_COMMISSION) *
    100;

  const custeioOperacional = isOnline
    ? REVENUE_ALLOCATION.OPERATIONAL_CUSTEIO * 100 + comissaoDiff
    : REVENUE_ALLOCATION.OPERATIONAL_CUSTEIO * 100;

  return [
    {
      name: 'Prêmio Bruto',
      value: Number((REVENUE_ALLOCATION.PRIZE_POOL * 100).toFixed(2)),
      color: 'hsl(142, 71%, 45%)',
    },
    {
      name: 'Seguridade Social',
      value: Number((REVENUE_ALLOCATION.SOCIAL_SECURITY * 100).toFixed(2)),
      color: 'hsl(217, 91%, 60%)',
    },
    {
      name: 'Custeio de despesas operacionais',
      value: Number(custeioOperacional.toFixed(2)),
      color: 'hsl(215, 16%, 47%)',
    },
    {
      name: 'Comissão dos lotéricos *',
      value: Number(comissaoLotericos.toFixed(2)),
      color: 'hsl(215, 20%, 55%)',
    },
    {
      name: 'Fundo Nacional de Segurança Pública - FNSP',
      value: Number((REVENUE_ALLOCATION.PUBLIC_SECURITY * 100).toFixed(2)),
      color: 'hsl(0, 84%, 60%)',
    },
    {
      name: 'Fundo Penitenciário Nacional - FUNPEN',
      value: Number((REVENUE_ALLOCATION.PENITENTIARY * 100).toFixed(2)),
      color: 'hsl(280, 65%, 60%)',
    },
    {
      name: 'Fundo Nacional da Cultura - FNC',
      value: Number((REVENUE_ALLOCATION.CULTURE * 100).toFixed(2)),
      color: 'hsl(190, 90%, 50%)',
    },
    {
      name: 'Ministério do Esporte',
      value: Number((REVENUE_ALLOCATION.SPORT * 100).toFixed(2)),
      color: 'hsl(150, 60%, 50%)',
    },
    {
      name: 'Comitê Olímpico do Brasil - COB',
      value: Number((REVENUE_ALLOCATION.COB * 100).toFixed(2)),
      color: 'hsl(38, 92%, 50%)',
    },
    {
      name: 'Secretarias de esporte, ou órgãos equivalentes, dos Estados e do Distrito Federal',
      value: Number((REVENUE_ALLOCATION.STATE_SPORTS * 100).toFixed(2)),
      color: 'hsl(38, 80%, 60%)',
    },
    {
      name: 'Comitê Paralímpico Brasileiro - CPB',
      value: Number((REVENUE_ALLOCATION.CPB * 100).toFixed(2)),
      color: 'hsl(38, 70%, 55%)',
    },
    {
      name: 'Fundo de Desenvolvimento de Loterias - FDL',
      value: Number((REVENUE_ALLOCATION.OPERATIONAL_FDL * 100).toFixed(2)),
      color: 'hsl(215, 25%, 65%)',
    },
    {
      name: 'Comitê Brasileiro de Clubes - CBC',
      value: Number((REVENUE_ALLOCATION.CBC * 100).toFixed(2)),
      color: 'hsl(38, 60%, 45%)',
    },
    {
      name: 'Confederação Brasileira do Desporto Escolar - CBDE',
      value: Number((REVENUE_ALLOCATION.CBDE * 100).toFixed(2)),
      color: 'hsl(38, 50%, 40%)',
    },
    {
      name: 'Confederação Brasileira do Desporto Universitário - CBDU',
      value: Number((REVENUE_ALLOCATION.CBDU * 100).toFixed(2)),
      color: 'hsl(38, 40%, 35%)',
    },
    {
      name: 'Comitê Brasileiro de Clubes Paralímpicos - CBCP',
      value: Number((REVENUE_ALLOCATION.CBCP * 100).toFixed(2)),
      color: 'hsl(38, 30%, 30%)',
    },
    {
      name: 'Fenaclubes',
      value: Number((REVENUE_ALLOCATION.FENACLUBES * 100).toFixed(2)),
      color: 'hsl(215, 10%, 40%)',
    },
  ];
};

function MoneyFlowChart({ distributionData, expectedStats }: MoneyFlowChartProps) {
  const fmt = formatCurrency;

  return (
    <div className="glass-card p-6 top-6 ">
      <h3 className="font-display font-bold text-base text-foreground mb-1">
        Destino de cada R$ apostado
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        De R$ 6,00 apostados, apenas R$ 2,60 (43,35%) retornam como prêmio bruto
      </p>
      <div className="flex justify-center items-center">
        <ResponsiveContainer width={240} height={240}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={1}
              dataKey="value"
              stroke="none"
            >
              {distributionData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number, name: string) => [`${v}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Expected value breakdown */}
      <div className="mt-5 pt-4 border-t border-border space-y-2 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Você aposta:</span>
          <span className="text-foreground font-bold">{fmt(expectedStats.betAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Retorno esperado ({expectedStats.returnPercentage}%):
          </span>
          <span className="text-success font-bold">{fmt(expectedStats.expectedValue)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2">
          <span className="text-muted-foreground">Perda esperada:</span>
          <span className="text-hot font-bold">
            −{fmt(expectedStats.loss)} (-{expectedStats.percentageLoss}%)
          </span>
        </div>
      </div>

      <div className="pt-6 flex justify-center">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full sm:w-auto rounded-2xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
        >
          <a
            href="https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx#:~:text=Repasses%20Sociais-,Repasses%20Sociais,-Ao%20jogar%20na"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Entender os repasses oficiais
          </a>
        </Button>
      </div>
    </div>
  );
}

export function MoneyFlowList({ data }: { data: DistributionItem[] }) {
  return (
    <div className="glass-card p-6 h-full">
      <dl className="space-y-4 pr-2">
        {data.map((d) => (
          <div key={d.name}>
            <div className="flex justify-between text-xs mb-1.5 gap-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  aria-hidden="true"
                  style={{ backgroundColor: d.color }}
                />
                <dt className="text-muted-foreground truncate" title={d.name}>
                  {d.name}
                </dt>
              </div>
              <dd className="font-mono font-bold text-foreground whitespace-nowrap">{d.value}%</dd>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden" aria-hidden="true">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: d.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${d.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function MoneyFlowSection({ id }: { id: string }) {
  const { expectedReturn: expected } = useLotteryMath();
  const [isOnline, setIsOnline] = useState(false);

  const distributionData = useMemo(() => getRevenueDistributionData(isOnline), [isOnline]);

  return (
    <section id={id} className="container max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center p-4 bg-green-500/10 rounded-3xl mb-6 ring-1 ring-green-500/20">
          <PiggyBank className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight">
          O <span className="text-gradient-gold">Paraíso</span> da Banca
        </h2>

        <p className="text-xl text-muted-foreground leading-relaxed">
          A Mega-Sena é uma das formas mais eficientes de arrecadação do Estado. Apenas{' '}
          <span className="text-foreground font-bold">{expected.returnPercentage}%</span> de tudo o
          que é pago pelos apostadores retorna como prêmio. O restante tem destino certo.
        </p>
      </motion.div>

      <div className="flex bg-secondary/50 p-1 rounded-xl mb-12 w-fit mx-auto border border-border">
        <button
          onClick={() => setIsOnline(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isOnline ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Store className="w-4 h-4" />
          Lotérica Física
        </button>
        <button
          onClick={() => setIsOnline(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isOnline ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Smartphone className="w-4 h-4" />
          Canais Eletrônicos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <MoneyFlowChart distributionData={distributionData} expectedStats={expected} />
        <MoneyFlowList data={distributionData} />
      </div>
    </section>
  );
}
