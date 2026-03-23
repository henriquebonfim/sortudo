import { CHART_COLORS } from "@/domain/lottery/lottery.constants";
import { BubbleNode } from "./bubble-chart.types";

export function freqToColor(freq: number, min: number, max: number): string {
  const t = (freq - min) / (max - min || 1);
  if (t < 0.25) return CHART_COLORS.BLUE;
  if (t < 0.5) return CHART_COLORS.EMERALD;
  if (t < 0.75) return CHART_COLORS.AMBER;
  return CHART_COLORS.RED;
}

/**
 * Pure function to apply simplified physics simulation to nodes
 */
export function applyPhysics(nodes: BubbleNode[], width: number, height: number) {
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

/**
 * Renders all nodes onto the canvas
 */
export function renderNodes(ctx: CanvasRenderingContext2D, nodes: BubbleNode[]) {
  for (const n of nodes) {
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
    ctx.fillText(String(n.number), n.x, n.radius > 30 ? n.y - 6 : n.y);

    if (n.radius > 30) {
      ctx.fillStyle = "rgba(241,245,249,0.5)";
      ctx.font = `400 10px "JetBrains Mono"`;
      ctx.fillText(String(n.frequency), n.x, n.y + 10);
    }
  }
}
