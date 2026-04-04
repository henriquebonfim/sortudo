import { CHART_COLORS } from "@/features/analytics/charts/chart.constants";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function LifetimesToWinChart() {
  const chartData = useMemo(() => {
    // A standard 69 ball, 5 pick + 26 powerball setup = 292,201,338 odds
    const oddsOfWinning = 1 / 292_201_338;
    const oddsOfLosing = 1 - oddsOfWinning;

    // Assume someone plays 100 tickets every single week for 80 years
    const ticketsPerWeek = 100;
    const weeksPerYear = 52;
    const yearsPerLifetime = 80;

    const ticketsPerLifetime = ticketsPerWeek * weeksPerYear * yearsPerLifetime; // 416,000 tickets

    // We will chart multiple lifetimes
    const lifetimesToChart = [1, 10, 50, 100, 500, 1000, 2000, 3000];

    return lifetimesToChart.map(lifetimes => {
      const ticketsPurchased = ticketsPerLifetime * lifetimes;

      // Probability of NOT winning a single time in 'ticketsPurchased' attempts
      const probZeroWins = Math.pow(oddsOfLosing, ticketsPurchased);
      const probAtLeastOneWin = 1 - probZeroWins;

      return {
        lifetimes: lifetimes,
        displayLifetimes: lifetimes > 100 ? `${(lifetimes / 1000).toFixed(1)}k Vidas` : `${lifetimes} Vidas`,
        ticketsPurchased: ticketsPurchased,
        winProb: parseFloat((probAtLeastOneWin * 100).toFixed(2)),
        ruinProb: parseFloat((probZeroWins * 100).toFixed(2)) // "Risco da Ruína"
      };
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 border-l-4 border-l-red-900/50">
        <h3 className="text-xl font-bold mb-2 text-white">O Risco da Ruína (100 Bilhetes/Semana por 80 Anos)</h3>
        <p className="text-sm text-slate-300 mb-6 max-w-2xl leading-relaxed">
          É fácil dizer "eu nunca vou ganhar", mas é difícil visualizar matematicamente. Suponha que você compre 100 bilhetes todas as semanas, por 80 anos seguidos (custando $832 mil).
          <br /><br />
          Mesmo que você jogasse por 3.000 vidas contínuas, ainda haveria uma chance estatística de morrer sem nunca ter ganhado o prêmio. <strong>O "Risco da Ruína" nunca desaparece de verdade.</strong>
        </p>

        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={chartData} margin={{ left: 10, right: 30, top: 40, bottom: 40 }}>
            {/* The scale has to literally be logarithmic if we want to show anything meaningful */}
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="displayLifetimes"
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: "monospace" }}
              angle={-30}
              textAnchor="end"
              dy={15}
            />
            <YAxis
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: "monospace" }}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
              labelStyle={{ color: '#94A3B8' }}
              itemStyle={{ fontWeight: 'bold' }}
              formatter={(value: number, name: string) => {
                if (name === "winProb") return [`${value}% Chance`, "Probabilidade de um único prêmio"];
                if (name === "ruinProb") return [`${value}% Risco`, "Risco da Ruína (Perder Tudo)"];
                return [value, name];
              }}
            />
            {/* The Risk of Ruin falls over massive time spans, and Win Prob goes up */}
            <ReferenceLine y={50} stroke="#EAB308" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'Limite de 50/50 (Cara ou Coroa)', fill: '#EAB308', position: 'insideTopLeft' }} />
            <Area type="monotone" dataKey="winProb" fill="#10B981" stroke="#059669" fillOpacity={0.4} strokeWidth={2} />
            <Area type="monotone" dataKey="ruinProb" fill="#EF4444" stroke="#B91C1C" fillOpacity={0.4} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
