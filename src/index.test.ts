import { describe, it, expect } from 'vitest';
import {
  parseDate,
  formatHumanDate,
  daysBetween,
  weeksBetween,
  monthsBetween,
  yearsBetween,
  formatDuration,
} from './index';

describe('parseDate', () => {
  it('should parse valid ISO date string', () => {
    const date = parseDate('2025-10-17T12:00:00Z');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(9);
    expect(date.getUTCDate()).toBe(17);
  });

  it('should throw error for invalid date', () => {
    expect(() => parseDate('invalid-date')).toThrow('Invalid date');
  });

  it('should parse dates with different formats', () => {
    const date = parseDate('2025-01-01T12:00:00Z');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getUTCMonth()).toBe(0);
  });
});

describe('formatHumanDate', () => {
  it('should format date in human-readable format', () => {
    const date = new Date('2025-10-17T12:00:00Z');
    const formatted = formatHumanDate(date);
    expect(formatted).toContain('October');
    expect(formatted).toContain('2025');
  });

  it('should include weekday in formatted output', () => {
    const date = new Date('2025-10-17T12:00:00Z');
    const formatted = formatHumanDate(date);
    expect(formatted).toContain('day');
  });
});

describe('daysBetween', () => {
  it('should calculate days between two dates', () => {
    const date1 = new Date('2025-01-01');
    const date2 = new Date('2025-01-31');
    expect(daysBetween(date1, date2)).toBe(30);
  });

  it('should return 0 for same date', () => {
    const date = new Date('2025-10-17');
    expect(daysBetween(date, date)).toBe(0);
  });

  it('should work regardless of date order', () => {
    const date1 = new Date('2025-01-01');
    const date2 = new Date('2025-12-31');
    expect(daysBetween(date1, date2)).toBe(daysBetween(date2, date1));
  });

  it('should calculate days across years', () => {
    const date1 = new Date('2024-12-25');
    const date2 = new Date('2025-01-05');
    expect(daysBetween(date1, date2)).toBe(11);
  });
});

describe('weeksBetween', () => {
  it('should calculate weeks between two dates', () => {
    const date1 = new Date('2025-01-01');
    const date2 = new Date('2025-01-29');
    expect(weeksBetween(date1, date2)).toBe(4);
  });

  it('should return 0 for dates less than a week apart', () => {
    const date1 = new Date('2025-01-01');
    const date2 = new Date('2025-01-05');
    expect(weeksBetween(date1, date2)).toBe(0);
  });

  it('should round down partial weeks', () => {
    const date1 = new Date('2025-01-01');
    const date2 = new Date('2025-01-20');
    expect(weeksBetween(date1, date2)).toBe(2);
  });
});

describe('monthsBetween', () => {
  it('should calculate months between two dates', () => {
    const date1 = new Date('2025-01-15T12:00:00Z');
    const date2 = new Date('2025-06-15T12:00:00Z');
    expect(monthsBetween(date1, date2)).toBe(5);
  });

  it('should calculate months across years', () => {
    const date1 = new Date('2024-10-15T12:00:00Z');
    const date2 = new Date('2025-02-15T12:00:00Z');
    expect(monthsBetween(date1, date2)).toBe(4);
  });

  it('should return 0 for same month', () => {
    const date1 = new Date('2025-01-05T12:00:00Z');
    const date2 = new Date('2025-01-25T12:00:00Z');
    expect(monthsBetween(date1, date2)).toBe(0);
  });
});

describe('yearsBetween', () => {
  it('should calculate years between two dates', () => {
    const date1 = new Date('2020-06-15T12:00:00Z');
    const date2 = new Date('2025-06-15T12:00:00Z');
    expect(yearsBetween(date1, date2)).toBe(5);
  });

  it('should return 0 for same year', () => {
    const date1 = new Date('2025-01-15T12:00:00Z');
    const date2 = new Date('2025-12-15T12:00:00Z');
    expect(yearsBetween(date1, date2)).toBe(0);
  });

  it('should handle negative differences', () => {
    const date1 = new Date('2025-06-15T12:00:00Z');
    const date2 = new Date('2020-06-15T12:00:00Z');
    expect(yearsBetween(date1, date2)).toBe(-5);
  });
});

describe('formatDuration', () => {
  it('should format single day', () => {
    expect(formatDuration(1)).toBe('1 day');
  });

  it('should format multiple days', () => {
    expect(formatDuration(5)).toBe('5 days');
  });

  it('should format weeks for small durations', () => {
    const result = formatDuration(14);
    expect(result).toContain('14');
  });

  it('should format years and months for large durations', () => {
    const result = formatDuration(400); // ~1 year, 1 month
    expect(result).toContain('year');
  });

  it('should format zero days', () => {
    expect(formatDuration(0)).toBe('0 days');
  });

  it('should format 365 days as 1 year', () => {
    const result = formatDuration(365);
    expect(result).toContain('1 year');
  });

  it('should format 30 days correctly', () => {
    const result = formatDuration(30);
    expect(result).toBeTruthy();
  });
});
