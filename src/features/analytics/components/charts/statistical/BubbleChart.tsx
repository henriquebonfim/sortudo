import { LoadingBalls } from '@/shared/components/LoadingBalls';
import { useFrequencies, useLotteryMeta, useLotteryMetadata } from '@/store/selectors';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { BubbleNode } from './bubble-chart.types';
import { applyPhysics, freqToColor, renderNodes } from './bubble-chart.utils';
import { FilterMode } from './frequency-bar.constants';

interface BubbleChartProps {
  filter: FilterMode;
}

const START_YEAR = 1996;

export function BubbleChart({ filter }: BubbleChartProps) {
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

  const currentYear = new Date().getFullYear();
  const yearsPassed = Math.max(1, currentYear - START_YEAR);
  const getRanking = (n: number) => rankingData.findIndex((s) => s.n === n) + 1;

  if (!data || !analyticsMeta || !lotteryMeta || !data.frequencies || !data.max || !data.min) {
    return <LoadingBalls />;
  }

  const freqDiff = data.max.frequency - data.min.frequency;

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
