# 📅 DateMath CLI

A beautiful command-line tool for date calculations in natural language. Calculate days between dates, add/subtract time periods, and get human-readable date information.

[![Version](https://img.shields.io/npm/v/datemath-cli.svg)](https://www.npmjs.com/package/datemath-cli)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Downloads](https://img.shields.io/npm/dt/datemath-cli.svg)](https://www.npmjs.com/package/datemath-cli)

## ✨ Features

- 🎨 Beautiful gradient ASCII art welcome screen
- 📊 Calculate days/weeks/months/years between dates
- ➕ Add or subtract time periods from dates
- 🗓️ Display dates in human-readable format
- 💬 Interactive calculator mode
- ⚡ Fast and lightweight
- 🎯 Type-safe TypeScript implementation
- ✅ Comprehensive test coverage

## 🚀 Installation

### Global Installation (Recommended)

```bash
npm install -g datemath-cli
```

### Local Development

```bash
npm install
npm run dev
```

### Use with npx (No Installation)

```bash
npx datemath-cli <command>
```

## 📖 Usage

### Show Today's Date

```bash
datemath today
```

**Output:**
```
📅 Today is:
Friday, October 17, 2025
ISO format: 2025-10-17
```

### Calculate Days Since a Date

```bash
datemath since 2025-01-01
```

**Output:**
```
📊 Time since Wednesday, January 1, 2025:
289 days
```

With verbose output:
```bash
datemath since 2025-01-01 -v
```

**Output:**
```
📊 Time since Wednesday, January 1, 2025:
289 days
  = 41 weeks
  = 9 months, 19 days
```

### Calculate Days Until a Date

```bash
datemath to 2025-12-25
```

**Output:**
```
📊 Time until Thursday, December 25, 2025:
69 days
```

Alias:
```bash
datemath until 2025-12-25
```

### Calculate Time Between Two Dates

```bash
datemath between 2025-01-01 2025-10-17
```

**Output:**
```
📊 Time between Wednesday, January 1, 2025 and Friday, October 17, 2025:
289 days
```

With specific unit:
```bash
datemath between 2025-01-01 2025-10-17 --unit weeks
```

**Output:**
```
41 weeks
```

Show all units:
```bash
datemath between 2025-01-01 2025-10-17 -v
```

**Output:**
```
📊 Time between Wednesday, January 1, 2025 and Friday, October 17, 2025:
  289 days
  41 weeks
  9 months
  0 years
  9 months, 19 days
```

### Add Time to a Date

```bash
datemath add 2025-10-17 30 days
datemath add 2025-10-17 5 weeks
datemath add 2025-10-17 2 months
datemath add 2025-10-17 1 year
```

**Output:**
```
📊 Friday, October 17, 2025 + 30 days:
Saturday, November 16, 2025
ISO format: 2025-11-16
```

### Subtract Time from a Date

```bash
datemath subtract 2025-10-17 30 days
datemath sub 2025-10-17 5 weeks
```

**Output:**
```
📊 Friday, October 17, 2025 - 30 days:
Thursday, September 17, 2025
ISO format: 2025-09-17
```

### Interactive Calculator Mode

```bash
datemath calc
```

This launches an interactive prompt where you can:
- Choose the type of calculation
- Enter dates step-by-step
- Get instant results with beautiful formatting

## 🎯 Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `today` | Show today's date | `datemath today` |
| `since <date>` | Days since a date | `datemath since 2025-01-01` |
| `to <date>` | Days until a date | `datemath to 2025-12-25` |
| `until <date>` | Alias for `to` | `datemath until 2025-12-25` |
| `between <date1> <date2>` | Time between dates | `datemath between 2025-01-01 2025-10-17` |
| `add <date> <amount> <unit>` | Add time to date | `datemath add 2025-01-01 30 days` |
| `subtract <date> <amount> <unit>` | Subtract time from date | `datemath sub 2025-01-01 30 days` |
| `calc` | Interactive calculator | `datemath calc` |

### Options

- `-v, --verbose` - Show detailed breakdown (for `since`, `to`, `between`)
- `-u, --unit <unit>` - Specify unit: days, weeks, months, years (for `between`)
- `-h, --help` - Show help
- `-V, --version` - Show version

### Date Format

All dates must be in **ISO 8601 format**: `YYYY-MM-DD`

Examples:
- `2025-10-17` ✅
- `2025-01-01` ✅
- `10/17/2025` ❌
- `17-10-2025` ❌

### Time Units

Supported units for add/subtract commands:
- `day` or `days`
- `week` or `weeks`
- `month` or `months`
- `year` or `years`

## 🛠️ Development

### Setup

```bash
# Clone the repository
git clone https://github.com/ahmadawais/datemath-cli.git
cd datemath-cli

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Available Scripts

```bash
npm run dev          # Run in development mode with watch
npm run build        # Build for production
npm test            # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run typecheck    # Type check without emitting
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

### Project Structure

```
datemath-cli/
├── src/
│   ├── index.ts         # Main CLI entry point
│   └── index.test.ts    # Test suite
├── dist/                # Compiled output (generated)
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tsup.config.ts       # Build configuration
├── vitest.config.ts     # Test configuration
└── README.md            # This file
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (re-runs on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Building

```bash
# Build the project
npm run build

# Test the built version locally
npm link
datemath today
```

## 📦 Publishing

```bash
# Update version
npm version patch  # or minor, or major

# Build
npm run build

# Publish to npm
npm publish

# Push tags to git
git push --tags
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Ahmad Awais** - [Website](https://ahmadawais.com) · [GitHub](https://github.com/ahmadawais) · [Twitter](https://twitter.com/MrAhmadAwais)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js)
- Beautiful prompts by [@clack/prompts](https://github.com/natemoo-re/clack)
- Styled with [Chalk](https://github.com/chalk/chalk) and [gradient-string](https://github.com/bokub/gradient-string)

## 📧 Support

If you have any questions or run into issues, please [open an issue](https://github.com/ahmadawais/datemath-cli/issues) on GitHub.

---

Made with 💜 by [Ahmad Awais](https://ahmadawais.com)
