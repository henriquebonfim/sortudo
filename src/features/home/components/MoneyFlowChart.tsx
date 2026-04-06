import { Button } from '@/shared/components/ui/Button';
import { formatCurrency } from '@/lib/lottery/utils';
import { tooltipStyle } from '@/shared/utils/motion';
import { BarChart3 } from 'lucide-react';
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

export function MoneyFlowChart({ distributionData, expectedStats }: MoneyFlowChartProps) {
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
