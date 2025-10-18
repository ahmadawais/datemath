import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { program, welcome } from './index';

describe('CLI Program', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let processExitSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: any) => {
      throw new Error(`Process.exit called with code ${code}`);
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe('welcome', () => {
    it('should display welcome screen', () => {
      welcome();
      expect(consoleLogSpy).toHaveBeenCalled();
      const calls = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' '));
      const output = calls.join('\n');
      expect(output).toContain('datemath-cli');
      expect(output).toMatch(/v\d+\.\d+\.\d+/);
    });
  });

  describe('program configuration', () => {
    it('should have correct name', () => {
      expect(program.name()).toBe('datemath');
    });

    it('should have correct version', () => {
      expect(program.version()).toMatch(/\d+\.\d+\.\d+/);
    });

    it('should have description', () => {
      const desc = program.description();
      expect(desc).toContain('date');
    });
  });

  describe('today command', () => {
    it('should execute today command', async () => {
      await program.parseAsync(['node', 'test', 'today']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Today is:');
    });
  });

  describe('since command', () => {
    it('should execute since command with valid date', async () => {
      await program.parseAsync(['node', 'test', 'since', '2025-01-01']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Time since');
    });

    it('should execute since command with verbose flag', async () => {
      await program.parseAsync(['node', 'test', 'since', '2025-01-01', '-v']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('weeks');
    });

    it('should handle invalid date in since command', async () => {
      try {
        await program.parseAsync(['node', 'test', 'since', 'invalid']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('to/until command', () => {
    it('should execute to command with future date', async () => {
      await program.parseAsync(['node', 'test', 'to', '2026-12-31']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Time');
    });

    it('should execute until command (alias)', async () => {
      await program.parseAsync(['node', 'test', 'until', '2026-12-31']);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle past date in to command', async () => {
      await program.parseAsync(['node', 'test', 'to', '2020-01-01']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('is in the past');
    });

    it('should execute to command with verbose flag', async () => {
      await program.parseAsync(['node', 'test', 'to', '2026-12-31', '--verbose']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('weeks');
    });
  });

  describe('between command', () => {
    it('should execute between command', async () => {
      await program.parseAsync(['node', 'test', 'between', '2025-01-01', '2025-12-31']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Time between');
    });

    it('should execute between command with weeks unit', async () => {
      await program.parseAsync(['node', 'test', 'between', '2025-01-01', '2025-12-31', '--unit', 'weeks']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('weeks');
    });

    it('should execute between command with months unit', async () => {
      await program.parseAsync(['node', 'test', 'between', '2025-01-01', '2025-12-31', '--unit', 'months']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('months');
    });

    it('should execute between command with years unit', async () => {
      await program.parseAsync(['node', 'test', 'between', '2020-01-01', '2025-12-31', '--unit', 'years']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('years');
    });

    it('should execute between command with verbose flag', async () => {
      await program.parseAsync(['node', 'test', 'between', '2025-01-01', '2025-12-31', '--verbose']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('days');
      expect(output).toContain('weeks');
      expect(output).toContain('months');
      expect(output).toContain('years');
    });

    it('should handle dates in reverse order', async () => {
      await program.parseAsync(['node', 'test', 'between', '2025-12-31', '2025-01-01']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Time between');
    });

    it('should handle invalid unit', async () => {
      try {
        await program.parseAsync(['node', 'test', 'between', '2025-01-01', '2025-12-31', '--unit', 'invalidunit']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
        expect(consoleErrorSpy).toHaveBeenCalled();
        const errorOutput = consoleErrorSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
        expect(errorOutput).toContain('Unknown unit');
      }
    });
  });

  describe('add command', () => {
    it('should add days to a date', async () => {
      await program.parseAsync(['node', 'test', 'add', '2025-01-01', '30', 'days']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('+ 30 days');
    });

    it('should add weeks to a date', async () => {
      await program.parseAsync(['node', 'test', 'add', '2025-01-01', '2', 'weeks']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('+ 2 weeks');
    });

    it('should add months to a date', async () => {
      await program.parseAsync(['node', 'test', 'add', '2025-01-01', '3', 'months']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('+ 3 months');
    });

    it('should add years to a date', async () => {
      await program.parseAsync(['node', 'test', 'add', '2025-01-01', '1', 'year']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('+ 1 year');
    });

    it('should handle singular day unit', async () => {
      await program.parseAsync(['node', 'test', 'add', '2025-01-01', '1', 'day']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('+ 1 day');
    });

    it('should handle singular week unit', async () => {
      await program.parseAsync(['node', 'test', 'add', '2025-01-01', '1', 'week']);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle singular month unit', async () => {
      await program.parseAsync(['node', 'test', 'add', '2025-01-01', '1', 'month']);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle singular years unit', async () => {
      await program.parseAsync(['node', 'test', 'add', '2025-01-01', '1', 'years']);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle invalid amount', async () => {
      try {
        await program.parseAsync(['node', 'test', 'add', '2025-01-01', 'invalid', 'days']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle invalid unit', async () => {
      try {
        await program.parseAsync(['node', 'test', 'add', '2025-01-01', '30', 'invalid']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('subtract command', () => {
    it('should subtract days from a date', async () => {
      await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', '30', 'days']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('- 30 days');
    });

    it('should subtract weeks from a date', async () => {
      await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', '2', 'weeks']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('- 2 weeks');
    });

    it('should subtract months from a date', async () => {
      await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', '3', 'months']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('- 3 months');
    });

    it('should subtract years from a date', async () => {
      await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', '1', 'years']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('- 1 years');
    });

    it('should work with sub alias', async () => {
      await program.parseAsync(['node', 'test', 'sub', '2025-12-31', '30', 'days']);
      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('- 30 days');
    });

    it('should handle singular day unit', async () => {
      await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', '1', 'day']);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle singular week unit', async () => {
      await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', '1', 'week']);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle singular month unit', async () => {
      await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', '1', 'month']);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle singular year unit', async () => {
      await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', '1', 'year']);
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle invalid amount', async () => {
      try {
        await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', 'invalid', 'days']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle invalid unit', async () => {
      try {
        await program.parseAsync(['node', 'test', 'subtract', '2025-12-31', '30', 'invalid']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle invalid date', async () => {
      try {
        await program.parseAsync(['node', 'test', 'subtract', 'invalid-date', '30', 'days']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('error handling for add command', () => {
    it('should handle invalid date', async () => {
      try {
        await program.parseAsync(['node', 'test', 'add', 'invalid-date', '30', 'days']);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('program export', () => {
    it('should export program', () => {
      expect(program).toBeDefined();
      expect(program.name()).toBe('datemath');
    });
  });

  describe('error handling for between command', () => {
    it('should handle invalid first date', async () => {
      try {
        await program.parseAsync(['node', 'test', 'between', 'invalid', '2025-12-31']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle invalid second date', async () => {
      try {
        await program.parseAsync(['node', 'test', 'between', '2025-01-01', 'invalid']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('error handling for to command', () => {
    it('should handle invalid date', async () => {
      try {
        await program.parseAsync(['node', 'test', 'to', 'invalid-date']);
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 1');
      }
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
