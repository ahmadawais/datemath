---
name: add-test
description: Add tests to datemath-cli. Use when adding new features or improving test coverage.
---

# Add Test

Add tests following Vitest patterns.

## When to Use

- Adding new utility functions
- Adding new commands
- Coverage drops below thresholds
- Bug fixes need test cases

## Requirements

Read `vitest.config.ts` for thresholds:
- 98.85% lines/statements
- 100% functions
- 87.95% branches
- calc-command.ts excluded

## Workflow

### 1. Read Existing Tests

Read `src/index.test.ts` for utility test patterns
Read `src/commands.test.ts` for command test patterns

### 2. Add Tests

Co-locate tests with source (*.test.ts)

Use template from `assets/test-template.ts`

### 3. Run Tests

```bash
pnpm test              # run once
pnpm test:watch        # watch mode
pnpm test:coverage     # check coverage
```

### 4. Check Coverage

Open `coverage/index.html` to see uncovered lines (red).

## Patterns

**Normal case:**
```typescript
expect(functionName(input)).toBe(expected);
```

**Error case:**
```typescript
expect(() => functionName(invalid)).toThrow('Error message');
```

**Range:**
```typescript
expect(result).toBeGreaterThan(0);
```

**String:**
```typescript
expect(output).toContain('text');
expect(output).toMatch(/regex/);
```

## Conventions

- Descriptive test names
- Test success and error cases
- Test edge cases (leap years, boundaries)
- One assertion per test (preferred)

## Template

See `assets/test-template.ts` for examples.
