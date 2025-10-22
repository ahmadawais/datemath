# DateMath CLI

TypeScript CLI for date calculations. Commander.js + @clack/prompts + chalk/figures.

## Stack

tsup (esbuild), Vitest, Commander.js, @clack/prompts, chalk, gradient-string, figures, ora

## Files

```
src/index.ts           - commands, utils, main entry
src/calc-command.ts    - interactive mode
src/*.test.ts          - co-located tests
tsup.config.ts         - build config
vitest.config.ts       - test config, coverage thresholds
tsconfig.json          - TS config
package.json           - bin: datemath, type: module
```

## Quick Start

```bash
pnpm dev              # watch mode
pnpm test             # run tests
pnpm build            # production build
```
