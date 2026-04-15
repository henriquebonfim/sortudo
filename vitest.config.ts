import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts', './vitest.setup.ts'],
    globals: true,
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'tests/e2e/**'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    sequence: {
      concurrent: true,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: path.resolve(__dirname, 'tests/coverage'),
      thresholds: {
        'src/features/**': {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
        'src/workers/**': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
        'src/shared/**': {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
      },
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.config.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
