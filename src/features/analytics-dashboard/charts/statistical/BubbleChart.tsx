import { useState, useMemo, useEffect, useRef, MouseEvent } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import { LoadingBalls } from "@/components/shared/LoadingBalls";
import { StatCard } from "@/components/shared/StatCard";
import { BubbleNode, Filter } from "./bubble-chart.types";
import { applyPhysics, freqToColor, renderNodes } from "./bubble-chart.utils";

const START_YEAR = 1996;
const FILTER_OPTIONS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos (60)" },
  { id: "top15", label: "Top 15 Mais Sorteados" },
  { id: "bottom15", label: "Top 15 Menos Sorteados" },
  { id: "mid", label: "Médios (Intermediários)" },
];

export default function BubbleChart() {
  const stats = useLotteryStore((state) => state.stats);
  const [filter, setFilter] = useState<Filter>("all");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: BubbleNode } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<BubbleNode[]>([]);
  const animRef = useRef<number>(0);

  const data = stats?.frequencies;
  const meta = stats?.meta;

  const filteredEntries = useMemo(() => {
    if (!data || !data.frequencies) return [];
    const entries = Object.entries(data.frequencies)
      .map(([k, v]) => ({ number: Number(k), frequency: v }))
      .sort((a, b) => b.frequency - a.frequency);

    switch (filter) {
      case "top15":
        return entries.slice(0, 15);
      case "bottom15":
        return [...entries].sort((a, b) => a.frequency - b.frequency).slice(0, 15);
      case "mid":
        return entries.slice(15, 45);
      default:
        return entries;
    }
  }, [data, filter]);

  const rankingData = useMemo(() => {
    if (!data?.frequencies) return [];
    return Object.entries(data.frequencies)
      .map(([k, v]) => ({ n: Number(k), f: v }))
      .sort((a, b) => b.f - a.f);
  }, [data?.frequencies]);

  useEffect(() => {
    if (!filteredEntries.length || !canvasRef.current || !containerRef.current || !data?.min || !data?.max) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");
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

  if (!data || !meta || !data.frequencies || !data.max || !data.min) {
    return <LoadingBalls />;
  }

  const freqDiff = data.max.frequency - data.min.frequency;
  const yearlyDiff = (freqDiff / yearsPassed).toFixed(0);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total de concursos" value={meta.totalDraws.toLocaleString("pt-BR")} />
        <StatCard label="Sem ganhador" value={`${meta.pctWithoutWinner}%`} variant="hot" />
        <StatCard label="Total ganhadores" value={meta.totalJackpotWinners.toLocaleString("pt-BR")} variant="gold" />
        <StatCard label="Nº mais sorteado" value={`${data.max.number} (${data.max.frequency}x)`} variant="gold" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`pill-btn ${filter === f.id ? "pill-btn-active" : "pill-btn-inactive"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="glass-card p-2 relative" aria-label="Gráfico de bolhas com frequências dos números da Mega-Sena">
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setTooltip(null)}
          className="w-full cursor-crosshair"
        />
        {tooltip && (
          <div
            className="absolute pointer-events-none z-10 glass-card p-3 text-xs font-mono border border-primary/30"
            style={{
              left: tooltip.x + 16,
              top: tooltip.y - 10,
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-foreground font-bold text-base mb-1">Nº {tooltip.node.number}</p>
            <p className="text-muted-foreground">Aparições: {tooltip.node.frequency}</p>
            <p className="text-muted-foreground">
              {((tooltip.node.frequency / meta.totalDraws) * 100).toFixed(1)}% dos sorteios
            </p>
            <p className="text-primary">Ranking #{getRanking(tooltip.node.number)} de 60</p>
          </div>
        )}
      </div>

      <div className="educational-box mt-8">
        <p className="text-sm text-muted-foreground">
          O número {data.max.number} saiu {data.max.frequency} vezes. O {data.min.number} saiu {data.min.frequency} vezes.
          São {freqDiff} sorteios de diferença em {yearsPassed} anos
          — menos de {yearlyDiff} por ano.
          <strong className="text-foreground"> Isso não prevê absolutamente nada sobre o próximo sorteio. Cada bola tem exatamente 1/60 de chance. Sempre.</strong>
        </p>
      </div>
    </>
  );
}
