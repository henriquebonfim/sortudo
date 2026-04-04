import { useLotteryMeta, useTypeComparison } from "@/application/selectors";
import { CHART_COLORS } from "@/features/analytics/charts/chart.constants";
import { ChartTooltip } from "@/features/analytics/shared/ChartTooltip";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function RegularVsSpecialChart() {
  const meta = useLotteryMeta();
  const data = useTypeComparison();

  if (!meta || !data) return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;

  const chartData = [
    {
      name: "Regular",
      avg: data.regular.avgPrize,
      max: data.regular.maxPrize,
      count: data.regular.count,
      color: CHART_COLORS.BLUE,
    },
    {
      name: "Especial",
      avg: data.special.avgPrize,
      max: data.special.maxPrize,
      count: data.special.count,
      color: CHART_COLORS.AMBER,
    },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
    return `R$ ${value.toLocaleString("pt-BR")}`;
  };

  return (
    <div className="space-y-4">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.GRID_STROKE} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: CHART_COLORS.TICK_LABEL, fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: CHART_COLORS.TICK_LABEL, fontSize: 10 }}
              tickFormatter={(v) => `R$${v / 1000000}M`}
            />
            <Tooltip
              content={
                <ChartTooltip
                  formatter={formatCurrency}
                  items={[
                    { label: "Média", value: "avg" },
                    { label: "Recorde", value: "max" },
                  ]}
                />
              }
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="avg" name="Prêmio Médio" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`avg-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Bar>
            <Bar dataKey="max" name="Prêmio Máximo" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`max-${index}`} fill={entry.color} fillOpacity={0.4} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {chartData.map((d) => (
          <div key={d.name} className="p-3 rounded-xl border bg-muted/20 flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {d.name === "Regular" ? "Sorteios Comuns" : "Mega da Virada"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-mono font-bold" style={{ color: d.color }}>
                {d.count}
              </span>
              <span className="text-[10px] text-muted-foreground">sorteios</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground italic text-center px-4">
        * Comparação direta entre a rentabilidade média de sorteios semanais vs. o evento anual especial.
      </p>
    </div>
  );
}
