import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names. Shadcn/ui convention — do not move or rename.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
