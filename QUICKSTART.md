# DateMath CLI - Quick Start

## Installation

```bash
cd datemath-cli
npm install
npm run build
npm link  # Makes the CLI available globally
```

## Quick Examples

### Show today's date
```bash
datemath today
```

### Calculate days since January 1st, 2025
```bash
datemath since 2025-01-01
```

### Calculate days until Christmas 2025
```bash
datemath to 2025-12-25
```

### Calculate time between two dates
```bash
datemath between 2025-01-01 2025-10-17 -v
```

### Add 30 days to a date
```bash
datemath add 2025-10-17 30 days
```

### Subtract 2 weeks from a date
```bash
datemath subtract 2025-10-17 2 weeks
```

### Interactive calculator
```bash
datemath calc
```

## Running Tests

```bash
npm test
```

## Development Mode

```bash
npm run dev
# Then pass commands like:
# npm run dev -- today
# npm run dev -- since 2025-01-01
```

## Features

✨ Beautiful gradient ASCII art welcome screen
📊 Multiple date calculation modes
⚡ Fast and lightweight
🎯 Type-safe TypeScript
✅ 25 passing tests

Enjoy using DateMath CLI! 🎉
