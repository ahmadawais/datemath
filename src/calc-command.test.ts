import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockIntro = vi.fn();
const mockSelect = vi.fn();
const mockText = vi.fn();
const mockIsCancel = vi.fn();
const mockCancel = vi.fn();
const mockOutro = vi.fn();

vi.mock('@clack/prompts', () => ({
  intro: (...args: any[]) => mockIntro(...args),
  select: (...args: any[]) => mockSelect(...args),
  text: (...args: any[]) => mockText(...args),
  isCancel: (...args: any[]) => mockIsCancel(...args),
  cancel: (...args: any[]) => mockCancel(...args),
  outro: (...args: any[]) => mockOutro(...args),
}));

import { calcCommand } from './calc-command';

describe('calcCommand', () => {
  let consoleLogSpy: any;
  let processExitSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: any) => {
      throw new Error(`Process.exit called with code ${code}`);
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe('since operation', () => {
    it('should calculate days since a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect.mockResolvedValue('since');
      mockText.mockResolvedValue('2025-01-01');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Result:');
    });

    it('should handle cancel on operation selection', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect.mockResolvedValue(Symbol('cancel'));
      mockIsCancel.mockReturnValue(true);
      mockCancel.mockImplementation(() => {});

      try {
        await calcCommand();
      } catch (error: any) {
        expect(error.message).toContain('Process.exit called with code 0');
      }

      expect(processExitSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('until operation', () => {
    it('should calculate days until a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect.mockResolvedValue('until');
      mockText.mockResolvedValue('2026-12-31');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Result:');
    });
  });

  describe('between operation', () => {
    it('should calculate days between two dates', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect.mockResolvedValue('between');
      mockText
        .mockResolvedValueOnce('2025-01-01')
        .mockResolvedValueOnce('2025-12-31');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Result:');
      expect(output).toContain('days between dates');
    });
  });

  describe('add operation', () => {
    it('should add days to a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect
        .mockResolvedValueOnce('add')
        .mockResolvedValueOnce('days');
      mockText
        .mockResolvedValueOnce('2025-01-01')
        .mockResolvedValueOnce('30');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Result:');
    });

    it('should add weeks to a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect
        .mockResolvedValueOnce('add')
        .mockResolvedValueOnce('weeks');
      mockText
        .mockResolvedValueOnce('2025-01-01')
        .mockResolvedValueOnce('2');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should add months to a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect
        .mockResolvedValueOnce('add')
        .mockResolvedValueOnce('months');
      mockText
        .mockResolvedValueOnce('2025-01-01')
        .mockResolvedValueOnce('3');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should add years to a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect
        .mockResolvedValueOnce('add')
        .mockResolvedValueOnce('years');
      mockText
        .mockResolvedValueOnce('2025-01-01')
        .mockResolvedValueOnce('1');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('subtract operation', () => {
    it('should subtract days from a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect
        .mockResolvedValueOnce('subtract')
        .mockResolvedValueOnce('days');
      mockText
        .mockResolvedValueOnce('2025-12-31')
        .mockResolvedValueOnce('30');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
      const output = consoleLogSpy.mock.calls.map((call: any[]) => call.join(' ')).join('\n');
      expect(output).toContain('Result:');
    });

    it('should subtract weeks from a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect
        .mockResolvedValueOnce('subtract')
        .mockResolvedValueOnce('weeks');
      mockText
        .mockResolvedValueOnce('2025-12-31')
        .mockResolvedValueOnce('2');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should subtract months from a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect
        .mockResolvedValueOnce('subtract')
        .mockResolvedValueOnce('months');
      mockText
        .mockResolvedValueOnce('2025-12-31')
        .mockResolvedValueOnce('3');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should subtract years from a date', async () => {
      mockIntro.mockImplementation(() => {});
      mockSelect
        .mockResolvedValueOnce('subtract')
        .mockResolvedValueOnce('years');
      mockText
        .mockResolvedValueOnce('2025-12-31')
        .mockResolvedValueOnce('1');
      mockIsCancel.mockReturnValue(false);
      mockOutro.mockImplementation(() => {});

      await calcCommand();

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });
});
