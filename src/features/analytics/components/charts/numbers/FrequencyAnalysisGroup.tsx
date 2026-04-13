import { ChartTooltip } from '@/features/analytics/components/charts/shared/ChartTooltip';
import { LoadingBalls } from '@/shared/components/LoadingBalls';
import { Button } from '@/shared/components/ui/Button';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useFrequencies, useLotteryMeta, useLotteryMetadata } from '@/store/selectors';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface BubbleChartProps {
  filter: FilterMode;
}
interface BubbleNode {
  number: number;
  frequency: number;
  radius: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface FrequencyBarChartProps {
  filter: FilterMode;
}
type FilterMode = 'top30' | 'bottom30' | 'all';

const FILTER_OPTIONS: { id: FilterMode; label: string }[] = [
  { id: 'top30', label: 'Top 30 mais sorteados' },
  { id: 'bottom30', label: 'Top 30 menos sorteados' },
  { id: 'all', label: 'Todos os 60' },
];
const LEGEND_ITEMS = [
  { color: CHART_COLORS.RED, label: 'Mais sorteados' },
  { color: CHART_COLORS.AMBER, label: 'Quentes' },
  { color: CHART_COLORS.EMERALD, label: 'Médios' },
  { color: CHART_COLORS.BLUE, label: 'Menos sorteados' },
];

function FrequencyBarChart({ filter }: FrequencyBarChartProps) {
  const data = useFrequencies();

  const chartData = useMemo(() => {
    if (!data?.ranking) return [];
    const ranking = [...data.ranking];
    if (filter === 'top30') return ranking.slice(0, 30);
    if (filter === 'bottom30') return ranking.slice(-30).reverse();
    return ranking;
  }, [data, filter]);

  if (!data?.ranking) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className=" ">
      <div className="p-4">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 8, right: 48, top: 4, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.GRID_STROKE}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <YAxis
              dataKey="number"
              type="category"
              tick={{ fontSize: 12, fill: CHART_COLORS.TICK_LABEL, fontFamily: 'monospace' }}
              width={32}
            />
            <Tooltip
              content={(props) => <ChartTooltip {...props} />}
              cursor={{ fill: CHART_COLORS.CURSOR }}
            />
            <Bar dataKey="frequency" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.number}
                  fill={freqToColor(entry.frequency, data.min.frequency, data.max.frequency)}
                />
              ))}
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(v: number) => `${v}%`}
                style={{
                  fontSize: 10,
                  fill: CHART_COLORS.TICK_LABEL,
                  fontFamily: 'monospace',
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function freqToColor(freq: number, min: number, max: number): string {
  const t = (freq - min) / (max - min || 1);
  if (t < 0.25) return CHART_COLORS.BLUE;
  if (t < 0.5) return CHART_COLORS.EMERALD;
  if (t < 0.75) return CHART_COLORS.AMBER;
  return CHART_COLORS.RED;
}

function applyPhysics(nodes: BubbleNode[], width: number, height: number) {
  // Center gravity pull
  for (const n of nodes) {
    n.vx += (width / 2 - n.x) * 0.002;
    n.vy += (height / 2 - n.y) * 0.002;
  }

  // Collision detection and response
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const distSq = dx * dx + dy * dy;
      const minDist = nodes[i].radius + nodes[j].radius + 3;

      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        const force = (minDist - dist) * 0.02;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;
      }
    }
  }

  // Friction and boundary containment
  for (const n of nodes) {
    n.vx *= 0.85;
    n.vy *= 0.85;
    n.x += n.vx;
    n.y += n.vy;
    n.x = Math.max(n.radius, Math.min(width - n.radius, n.x));
    n.y = Math.max(n.radius, Math.min(height - n.radius, n.y));
  }
}


function renderNodes(ctx: CanvasRenderingContext2D, nodes: BubbleNode[]) {
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    ctx.fillStyle = n.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#f1f5f9';
    ctx.font = `bold ${n.radius > 25 ? 16 : 12}px "JetBrains Mono"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(n.number), n.x, n.radius > 30 ? n.y - 6 : n.y);

    if (n.radius > 30) {
      ctx.fillStyle = 'rgba(241,245,249,0.5)';
      ctx.font = `400 10px "JetBrains Mono"`;
      ctx.fillText(String(n.frequency), n.x, n.y + 10);
    }
  }
}

function BubbleChart({ filter }: BubbleChartProps) {
  const analyticsMeta = useLotteryMeta();
  const lotteryMeta = useLotteryMetadata();
  const data = useFrequencies();
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: BubbleNode } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<BubbleNode[]>([]);
  const animRef = useRef<number>(0);

  const filteredEntries = useMemo(() => {
    if (!data || !data.frequencies) return [];
    const entries = Object.entries(data.frequencies)
      .map(([k, v]) => ({ number: Number(k), frequency: v }))
      .sort((a, b) => b.frequency - a.frequency);

    switch (filter) {
      case 'top30':
        return entries.slice(0, 30);
      case 'bottom30':
        return [...entries].sort((a, b) => a.frequency - b.frequency).slice(0, 30);
      default:
        return entries;
    }
  }, [data, filter]);

  const rankingData = useMemo(() => {
    if (!data?.frequencies) return [];
    return Object.entries(data.frequencies)
      .map(([k, v]) => ({ n: Number(k), f: v }))
      .sort((a, b) => b.f - a.f);
  }, [data]);

  useEffect(() => {
    if (
      !filteredEntries.length ||
      !canvasRef.current ||
      !containerRef.current ||
      !data?.min ||
      !data?.max
    )
      return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const W = rect.width;
    const H = 500;

    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const minFreq = data.min.frequency;
    const maxFreq = data.max.frequency;

    // Initialize nodes
    const initialNodes: BubbleNode[] = filteredEntries.map((e) => {
      const t = (e.frequency - minFreq) / (maxFreq - minFreq || 1);
      return {
        number: e.number,
        frequency: e.frequency,
        radius: 16 + t * 32,
        color: freqToColor(e.frequency, minFreq, maxFreq),
        x: W / 2 + (Math.random() - 0.5) * W * 0.5,
        y: H / 2 + (Math.random() - 0.5) * H * 0.5,
        vx: 0,
        vy: 0,
      };
    });

    nodesRef.current = initialNodes;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      applyPhysics(initialNodes, W, H);
      renderNodes(ctx, initialNodes);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animRef.current);
  }, [filteredEntries, data?.min, data?.max]);

  // Event handlers
  const handleCanvasMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = nodesRef.current.find((n) => {
      const dx = mx - n.x;
      const dy = my - n.y;
      return dx * dx + dy * dy < n.radius * n.radius;
    });

    if (hit) {
      setTooltip({ x: mx, y: my, node: hit });
    } else {
      setTooltip(null);
    }
  };

  const getRanking = (n: number) => rankingData.findIndex((s) => s.n === n) + 1;

  if (!data || !analyticsMeta || !lotteryMeta || !data.frequencies || !data.max || !data.min) {
    return <LoadingBalls />;
  }

  return (
    <section className="space-y-6">
      <div
        ref={containerRef}
        className="p-2 relative"
        aria-label="Gráfico de bolhas com frequências dos números da Mega-Sena"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setTooltip(null)}
          className="w-full cursor-crosshair"
        />
        {tooltip && (
          <div
            className="absolute pointer-events-none z-10 glass-card p-3 text-xs font-mono border border-border bg-background/90 backdrop-blur-md shadow-2xl"
            style={{
              left: tooltip.x + 16,
              top: tooltip.y - 10,
            }}
          >
            <p className="text-foreground font-bold text-base mb-1">Nº {tooltip.node.number}</p>
            <p className="text-muted-foreground">Aparições: {tooltip.node.frequency}</p>
            <p className="text-muted-foreground">
              {((tooltip.node.frequency / lotteryMeta.totalGames) * 100).toFixed(1)}% dos jogos
            </p>
            <p className="text-primary">Ranking #{getRanking(tooltip.node.number)} de 60</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function FrequencyAnalysisGroup() {
  const [filter, setFilter] = useState<FilterMode>('all');
  const data = useFrequencies();

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <FrequencyBarChart filter={filter} />
        <BubbleChart filter={filter} />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {FILTER_OPTIONS.map((f) => (
          <Button
            key={f.id}
            onClick={() => setFilter(f.id)}
            variant={filter === f.id ? 'default' : 'outline'}
            size="sm"
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 text-[10px] sm:text-xs text-muted-foreground justify-center mt-6 py-4 border-t border-border">
        {LEGEND_ITEMS.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
