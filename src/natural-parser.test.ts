import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { parseNaturalDate } from './natural-parser';

describe('parseNaturalDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-10-22T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should parse "today"', () => {
    const result = parseNaturalDate('today');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(22);
  });

  it('should parse "yesterday"', () => {
    const result = parseNaturalDate('yesterday');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(21);
  });

  it('should parse "tomorrow"', () => {
    const result = parseNaturalDate('tomorrow');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(23);
  });

  it('should parse day names (Friday)', () => {
    const result = parseNaturalDate('Friday');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(17);
  });

  it('should parse day names (Monday)', () => {
    const result = parseNaturalDate('Monday');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(20);
  });

  it('should parse day names (Sunday)', () => {
    const result = parseNaturalDate('Sunday');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(19);
  });

  it('should parse ISO dates', () => {
    const result = parseNaturalDate('2025-01-01');
    expect(result.toISOString().split('T')[0]).toBe('2025-01-01');
  });

  it('should handle case insensitivity', () => {
    const result = parseNaturalDate('FRIDAY');
    expect(result.getDate()).toBe(17);
  });

  it('should handle extra whitespace', () => {
    const result = parseNaturalDate('  friday  ');
    expect(result.getDate()).toBe(17);
  });

  it('should throw error for invalid input', () => {
    expect(() => parseNaturalDate('invalid')).toThrow('Unable to parse date');
  });

  it('should throw error for invalid ISO date', () => {
    expect(() => parseNaturalDate('2025-13-45')).toThrow('Unable to parse date');
  });
});
