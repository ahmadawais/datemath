---
name: add-command
description: Add new command to datemath-cli. Use when user requests new date calculation features or commands.
---

# Add Command

Add new commands following established patterns.

## When to Use

- New date calculation command
- New date operation/feature
- Extension of existing functionality

## Workflow

### 1. Read Existing Code

Read `src/index.ts` to see existing commands (today, since, to, between, add, subtract). Follow same patterns.

### 2. Add Utility Function

If calculation logic needed, export before commands in `src/index.ts`:

```typescript
export const yourCalc = (date: Date): ReturnType => {
  // logic
  return result;
};
```

Export for testing. See existing: parseDate, formatHumanDate, daysBetween, weeksBetween, monthsBetween, yearsBetween, formatDuration.

### 3. Add Command

In `src/index.ts` after existing commands, use template from `assets/command-template.ts`.

### 4. Add to Interactive

In `src/calc-command.ts`:
- Add to select options array
- Handle in if/else chain
- Set quickCommand for tip

Read existing operations for pattern.

### 5. Add Tests

In `src/index.test.ts` - test utility functions
In `src/commands.test.ts` - test command integration

Use template from `../add-test/assets/test-template.ts`.

### 6. Test & Document

```bash
pnpm dev              # test manually
pnpm test             # run tests
pnpm test:coverage    # check coverage
```

Update README.md command reference.

## Conventions

**Dates:** ISO 8601 only (YYYY-MM-DD), parseDate() validates
**Style:** figures not emoji, chalk.cyan headers, chalk.bold.green results, chalk.dim secondary, chalk.red errors
**Errors:** try-catch, exit(1), show error.message
**Output:** console.log() at end for spacing
**Testing:** Export utils, maintain 98%+ coverage
**Commits:** emoji-log (📦 NEW:, 👌 IMPROVE:, 🐛 FIX:)

## Anti-patterns

❌ Emoji (use figures)
❌ Non-ISO dates
❌ Missing error handling
❌ No tests for exports
❌ Hardcoded values

## Template

See `assets/command-template.ts` for complete copy-paste template.
