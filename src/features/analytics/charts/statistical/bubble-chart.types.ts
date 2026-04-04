export type Filter = "all" | "top15" | "bottom15" | "mid";

export interface BubbleNode {
  number: number;
  frequency: number;
  radius: number;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}
