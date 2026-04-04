/**
 * Token Utility Types and Runtime Helpers
 *
 * Provides:
 * 1. `TokenPath<T>` — compile-time type for valid dotted token reference strings
 * 2. `PrimitiveTokenPath` — union of all valid primitive token paths
 * 3. `SemanticTokenPath` — union of all valid semantic token paths
 * 4. `resolveToken()` — runtime helper to follow a dotted path into the primitives object
 *
 * @example
 *   const path: PrimitiveTokenPath = "color.gold.500"; // ✅ type-safe
 *   const value = resolveToken(primitives, "color.gold.500"); // → "38 92% 50%"
 */

import { type Primitives, primitives } from "./primitives";
import { type SemanticTokens } from "./semantic";

// ─── TokenPath<T> Utility Type ────────────────────────────────────────────────

/**
 * Recursively generates a union of all valid dotted key paths for a nested object type.
 *
 * @example
 *   type P = TokenPath<{ color: { gold: { "500": string } } }>
 *   // → "color" | "color.gold" | "color.gold.500"
 */
export type TokenPath<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${TokenPath<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

// ─── Named Token Path Types ───────────────────────────────────────────────────

/** Union of all valid primitive token paths. */
export type PrimitiveTokenPath = TokenPath<Primitives>;

/** Union of all valid semantic token paths. */
export type SemanticTokenPath = TokenPath<SemanticTokens>;

// ─── Token Reference Format ───────────────────────────────────────────────────

/**
 * A typed token reference string.
 * Used in semantic.ts to reference primitive paths: "{color.gold.500}"
 *
 * @example
 *   const ref: TokenRef<PrimitiveTokenPath> = "{color.gold.500}";
 */
export type TokenRef<Path extends string> = `{${Path}}`;

/** Extracts the path from a token reference string. */
export type ExtractTokenPath<R extends string> =
  R extends `{${infer Path}}` ? Path : never;

// ─── Runtime Token Resolver ───────────────────────────────────────────────────

type NestedValue<T, Path extends string> = Path extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? NestedValue<T[K], Rest>
    : never
  : Path extends keyof T
  ? T[Path]
  : never;

/**
 * Resolves a dotted path string against a token object at runtime.
 * Returns the leaf value, typed as `string` (all primitive leaf values are strings or arrays).
 *
 * @param tokens - The token object to resolve against
 * @param path - Dotted path string
 *
 * @example
 *   resolveToken(primitives, "color.gold.500") // → "38 92% 50%"
 *   resolveToken(primitives, "shadow.md")      // → "0 4px 6px ..."
 */
export function resolveToken<T extends object, Path extends TokenPath<T>>(
  tokens: T,
  path: Path
): NestedValue<T, Path> {
  const parts = (path as string).split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = tokens;
  for (const part of parts) {
    if (current == null || typeof current !== "object") {
      throw new Error(`Token path "${path}" is invalid at segment "${part}"`);
    }
    current = current[part];
  }
  return current;
}

/**
 * Resolves a token reference string (e.g. "{color.gold.500}") against primitives.
 * Used to dereference semantic token values at runtime.
 *
 * @param ref - Token reference string in "{path}" format
 *
 * @example
 *   resolveRef("{color.gold.500}") // → "38 92% 50%"
 */
export function resolveRef(ref: string): string {
  const match = ref.match(/^\{(.+)\}$/);
  if (!match) return ref; // Not a reference — return as-is

  const path = match[1] as PrimitiveTokenPath;
  const resolved = resolveToken(primitives, path);

  if (Array.isArray(resolved)) return resolved[0]; // Font family arrays
  if (typeof resolved === "string") return resolved;
  throw new Error(`Token ref "${ref}" resolved to a non-string value`);
}

// ─── CSS Variable Name Formatter ─────────────────────────────────────────────

/**
 * Converts a dotted semantic token path to a CSS custom property name.
 *
 * @example
 *   toCSSVar("color.surface.card")   // → "--color-surface-card"
 *   toCSSVar("shadow.brandRing")     // → "--shadow-brandRing"
 */
export function toCSSVar(path: string): `--${string}` {
  return `--${path.replace(/\./g, "-")}`;
}

/**
 * Wraps a CSS variable name in `var()`.
 *
 * @example
 *   cssVar("color.surface.card") // → "var(--color-surface-card)"
 */
export function cssVar(path: string): string {
  return `var(${toCSSVar(path)})`;
}
