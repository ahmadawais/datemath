# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2025-10-18

### Improved
- Replaced emojis with figures package for better cross-platform terminal compatibility
- CLI now displays correctly on all terminal types with proper fallback characters

## [1.5.2] - 2025-10-18

### Improved
- Removed outro message for cleaner output

## [1.5.1] - 2025-10-18

### Fixed
- Welcome header now displays correctly in interactive mode

## [1.5.0] - 2025-10-18

### Improved
- Smart tip detection: shows `datemath` prefix for global installs and `npx datemath-cli` for npx usage
- Tips now match exactly how the user invoked the CLI for better copy-paste experience

## [1.4.0] - 2025-10-18

### Added
- Handy tip after interactive calculator completes showing the equivalent one-line command
- Users can now learn the direct command syntax by using the interactive mode first

### Improved
- Better user experience with educational tips for faster future usage

## [1.3.0] - 2025-10-18

### Changed
- Running `datemath` or `npx datemath-cli` without any commands now launches the interactive calculator mode by default
- Improved user experience for quick access to date calculations

### Added
- Quick start section in README demonstrating the new default behavior

## [1.2.0] - 2025-10-18

### Added
- Beautiful demo SVG showcasing CLI in action with terminal UI
- Shades of Purple theme colors throughout the CLI

### Changed
- Smaller, cleaner ASCII art header using block style characters
- Updated gradient colors to official Shades of Purple theme (#9EFFFF, #B362FF, #FB94FF)
- Modern flat-square style badges in README
- Improved demo examples with better use cases

## [1.1.0] - 2025-10-18

### Added
- Comprehensive test coverage for calc-command interactive mode
- Test coverage for all CLI commands (today, since, to, between, add, subtract)
- Test coverage for error handling across all commands

### Changed
- Improved test suite with 83 passing tests
- Achieved 98.85% code coverage (lines and statements)
- Achieved 100% function coverage
- Achieved 87.95% branch coverage

### Fixed
- Enhanced test reliability for command-line argument parsing
- Improved error handling test assertions

## [1.0.0] - 2025-10-18

### Added
- Initial release of DateMath CLI
- Natural language date calculations
- Commands: today, since, to/until, between, add, subtract, calc
- Interactive calculator mode
- Beautiful CLI output with colors and ASCII art
