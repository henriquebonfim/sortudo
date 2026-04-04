import { createContext, useContext, type ReactNode } from 'react';
import { THEME, type Theme } from './theme';

/**
 * ThemeContext — Design System Layer 4
 *
 * Surfaces the typed THEME constant into the React component tree.
 * This makes runtime color values tree-shakeable and refactor-safe:
 * changing a color in `theme.ts` propagates everywhere automatically.
 *
 * Usage:
 *   const { colors } = useTheme();
 *   <div style={{ color: colors.brand.DEFAULT }}>...</div>
 *
 * For recharts/canvas use CHART_COLORS instead (CSS vars are unsupported there).
 */

const ThemeContext = createContext<Theme>(THEME);

interface ThemeProviderProps {
  children: ReactNode;
  /** Override for testing. Defaults to the canonical THEME constant. */
  value?: Theme;
}

/**
 * ThemeProvider wraps the application root and injects the design token
 * context. Must be placed above any component that calls `useTheme()`.
 */
export function ThemeProvider({ children, value = THEME }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Returns the current design system THEME from React context.
 * @throws If called outside a ThemeProvider subtree.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
