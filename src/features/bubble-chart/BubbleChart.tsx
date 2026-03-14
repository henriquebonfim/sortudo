import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { megaService } from "@/services/api";
import { LoadingBalls } from "@/components/shared/LoadingBalls";
import { StatCard } from "@/components/shared/StatCard";
import type { FrequenciasResponse, MetaResponse } from "@/core/types/api";

type Filter = "all" | "top15" | "bottom15" | "mid";

interface BubbleNode {
  numero: number;
  freq: number;
  radius: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function freqToColor(freq: number, min: number, max: number): string {
  const t = (freq - min) / (max - min || 1);
  if (t < 0.33) return `hsl(217, 91%, ${55 + t * 15}%)`;
  if (t < 0.66) return `hsl(${142 - (t - 0.33) * 300}, 71%, 50%)`;
  return `hsl(${38 - (t - 0.66) * 110}, 92%, ${55 - (t - 0.66) * 10}%)`;
}

export default function BubbleChartPage() {
  const [data, setData] = useState<FrequenciasResponse | null>(null);
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: BubbleNode } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<BubbleNode[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    Promise.all([megaService.getFrequencias(), megaService.getMeta()]).then(([f, m]) => {
      setData(f);
      setMeta(m);
    });
  }, []);

  const filteredEntries = useMemo(() => {
    if (!data) return [];
    const entries = Object.entries(data.frequencias)
      .map(([k, v]) => ({ numero: Number(k), freq: v }))
      .sort((a, b) => b.freq - a.freq);

    switch (filter) {
      case "top15": return entries.slice(0, 15);
      case "bottom15": return entries.slice(-15);
      case "mid": return entries.slice(15, 45);
      default: return entries;
    }
  }, [data, filter]);

  // Physics simulation
  useEffect(() => {
    if (!filteredEntries.length || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d")!;
    const rect = container.getBoundingClientRect();
    const W = rect.width;
    const H = 500;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const freqs = filteredEntries.map((e) => e.freq);
    const minF = Math.min(...freqs);
    const maxF = Math.max(...freqs);

    const nodes: BubbleNode[] = filteredEntries.map((e) => {
      const t = (e.freq - minF) / (maxF - minF || 1);
      return {
        numero: e.numero,
        freq: e.freq,
        radius: 18 + t * 28,
        color: freqToColor(e.freq, minF, maxF),
        x: W / 2 + (Math.random() - 0.5) * W * 0.5,
        y: H / 2 + (Math.random() - 0.5) * H * 0.5,
        vx: 0,
        vy: 0,
      };
    });
    nodesRef.current = nodes;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      // Center gravity
      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * 0.002;
        n.vy += (H / 2 - n.y) * 0.002;
      }

      // Collision
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = nodes[i].radius + nodes[j].radius + 3;
          if (dist < minDist) {
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

      // Update + draw
      for (const n of nodes) {
        n.vx *= 0.85;
        n.vy *= 0.85;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(n.radius, Math.min(W - n.radius, n.x));
        n.y = Math.max(n.radius, Math.min(H - n.radius, n.y));

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#f1f5f9";
        ctx.font = `bold ${n.radius > 25 ? 16 : 12}px "JetBrains Mono"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(n.numero), n.x, n.radius > 30 ? n.y - 6 : n.y);

        if (n.radius > 30) {
          ctx.fillStyle = "rgba(241,245,249,0.5)";
          ctx.font = `400 10px "JetBrains Mono"`;
          ctx.fillText(String(n.freq), n.x, n.y + 10);
        }
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [filteredEntries]);

  // Canvas mouse handler for tooltip
  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = nodesRef.current.find((n) => {
      const dx = mx - n.x;
      const dy = my - n.y;
      return Math.sqrt(dx * dx + dy * dy) < n.radius;
    });

    if (hit) {
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, node: hit });
    } else {
      setTooltip(null);
    }
  };

  if (!data || !meta) return <LoadingBalls />;

  const sorted = Object.entries(data.frequencias)
    .map(([k, v]) => ({ n: Number(k), f: v }))
    .sort((a, b) => b.f - a.f);
  const ranking = (n: number) => sorted.findIndex((s) => s.n === n) + 1;

  return (
    <div className="container py-20 md:py-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-2">🫧 Visualizador de Bolhas</h1>
        <p className="section-subheading mb-8">
          Cada bolha representa um número da Mega-Sena. Tamanho e cor indicam a frequência de aparição.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total de concursos" value={meta.total_concursos.toLocaleString("pt-BR")} />
        <StatCard label="Sem ganhador" value={`${meta.pct_sem_ganhador}%`} variant="hot" />
        <StatCard label="Total ganhadores" value={meta.total_ganhadores_sena.toLocaleString("pt-BR")} variant="gold" />
        <StatCard label="Nº mais sorteado" value={`${data.max.numero} (${data.max.freq}x)`} variant="gold" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "all" as Filter, label: "Todos (60)" },
          { id: "top15" as Filter, label: "Top 15 mais sorteados" },
          { id: "bottom15" as Filter, label: "Top 15 menos sorteados" },
          { id: "mid" as Filter, label: "Intermediários" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`pill-btn ${filter === f.id ? "pill-btn-active" : "pill-btn-inactive"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
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
            <p className="text-foreground font-bold text-base mb-1">Nº {tooltip.node.numero}</p>
            <p className="text-muted-foreground">Aparições: {tooltip.node.freq}</p>
            <p className="text-muted-foreground">
              {((tooltip.node.freq / meta.total_concursos) * 100).toFixed(1)}% dos sorteios
            </p>
            <p className="text-primary">Ranking #{ranking(tooltip.node.numero)} de 60</p>
          </div>
        )}
      </div>

      {/* Educational */}
      <div className="educational-box mt-8">
        <p className="text-sm text-muted-foreground">
          O número {data.max.numero} saiu {data.max.freq} vezes. O {data.min.numero} saiu {data.min.freq} vezes.
          São {data.max.freq - data.min.freq} sorteios de diferença em {new Date().getFullYear() - 1996} anos
          — menos de {((data.max.freq - data.min.freq) / (new Date().getFullYear() - 1996)).toFixed(0)} por ano.
          <strong className="text-foreground"> Isso não prevê absolutamente nada sobre o próximo sorteio. Cada bola tem exatamente 1/60 de chance. Sempre.</strong>
        </p>
      </div>
    </div>
  );
}
