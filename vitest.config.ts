import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.test.ts',
        '**/*.config.ts',
        '**/calc-command.ts',
      ],
      thresholds: {
        lines: 98.85,
        functions: 100,
        branches: 87.95,
        statements: 98.85,
      },
    },
  },
});
