# 🎉 DateMath CLI - Your Project is Ready!

I've created a professional TypeScript CLI tool for date calculations with natural language support!

## 📦 What's Included

✅ **Full TypeScript CLI** with Commander.js
✅ **Beautiful gradient ASCII art** welcome screen
✅ **8 powerful commands** for date calculations
✅ **Interactive calculator mode** with @clack/prompts
✅ **25 passing tests** with Vitest
✅ **Complete documentation** in README.md
✅ **Production-ready build setup** with tsup

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd datemath-cli
npm install
```

### 2. Build the CLI
```bash
npm run build
```

### 3. Test It Out
```bash
# Run commands directly
node dist/index.js today
node dist/index.js since 2025-01-01
node dist/index.js to 2025-12-25

# Or use npm link to make it globally available
npm link
datemath today
```

## 📊 Available Commands

### Display Today's Date
```bash
datemath today
```
Output: Shows today's date in human-readable format with ISO format

### Days Since a Date
```bash
datemath since 2025-01-01
datemath since 2025-01-01 -v  # Verbose output
```

### Days Until a Date
```bash
datemath to 2025-12-25
datemath until 2025-12-25 -v  # Verbose output
```

### Time Between Two Dates
```bash
datemath between 2025-01-01 2025-10-17
datemath between 2025-01-01 2025-10-17 -v  # Show all units
datemath between 2025-01-01 2025-10-17 --unit weeks  # Specific unit
```

### Add Time to a Date
```bash
datemath add 2025-10-17 30 days
datemath add 2025-10-17 5 weeks
datemath add 2025-10-17 2 months
datemath add 2025-10-17 1 year
```

### Subtract Time from a Date
```bash
datemath subtract 2025-10-17 30 days
datemath sub 2025-10-17 5 weeks  # Short alias
```

### Interactive Calculator
```bash
datemath calc
```
Launches an interactive prompt with step-by-step guidance!

## 🧪 Running Tests

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

All 25 tests are passing! ✅

## 🛠️ Development

```bash
npm run dev             # Development mode with watch
npm run build           # Build for production
npm run typecheck       # Type checking
```

## 📝 Features Implemented

✨ **Natural Language**: Use friendly terms like "since", "until", "between"
📅 **ISO Format Support**: All dates in YYYY-MM-DD format
🎨 **Beautiful UI**: Gradient ASCII art and colorful output
⚡ **Fast**: Lightweight and instant calculations
🧮 **Multiple Units**: Days, weeks, months, years
📊 **Verbose Mode**: Detailed breakdowns with -v flag
🎯 **Type Safe**: Full TypeScript implementation
✅ **Well Tested**: Comprehensive test coverage
💬 **Interactive**: Built-in calculator mode

## 📚 Additional Files

- **README.md** - Complete documentation with examples
- **QUICKSTART.md** - Quick reference guide
- **.gitignore** - Git ignore patterns
- **package.json** - All dependencies and scripts
- **tsconfig.json** - TypeScript configuration
- **tsup.config.ts** - Build configuration
- **vitest.config.ts** - Test configuration

## 🎯 Example Session

```bash
$ datemath today
📅 Today is:
Friday, October 17, 2025
ISO format: 2025-10-17

$ datemath since 2025-01-01
📊 Time since Wednesday, January 1, 2025:
289 days

$ datemath between 2025-01-01 2025-10-17 -v
📊 Time between Wednesday, January 1, 2025 and Friday, October 17, 2025:
  289 days
  41 weeks
  9 months
  0 years
  9 months, 19 days

$ datemath add 2025-10-17 30 days
📊 Friday, October 17, 2025 + 30 days:
Sunday, November 16, 2025
ISO format: 2025-11-16
```

## 🎨 Visual Features

The CLI includes:
- Gradient-colored ASCII art banner (pastel colors)
- Emoji icons for different sections (📅, 📊, ⚠️)
- Color-coded output (cyan for headers, green for results)
- Dimmed text for supplementary information
- Clean separators and formatting

## 🚀 Next Steps

1. **Customize**: Edit the ASCII art in `src/index.ts` to personalize it
2. **Extend**: Add new commands for your specific needs
3. **Publish**: When ready, publish to npm with `npm publish`
4. **Share**: Share with your team or the community!

Enjoy your new DateMath CLI! 🎉
