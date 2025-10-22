// Template for adding tests to datemath-cli
// Copy and customize for your function/command

import { describe, it, expect } from 'vitest';
import { yourFunction } from './index';

describe('yourFunction', () => {
  // Test normal/happy path
  it('should handle normal case', () => {
    const input = new Date('2025-01-01');
    const result = yourFunction(input);
    expect(result).toBe('expected value');
  });
  
  // Test edge cases
  it('should handle leap year', () => {
    const leapYear = new Date('2024-02-29');
    const result = yourFunction(leapYear);
    expect(result).toBeDefined();
  });
  
  it('should handle year boundary', () => {
    const endOfYear = new Date('2025-12-31');
    const result = yourFunction(endOfYear);
    expect(result).toBeDefined();
  });
  
  // Test error cases
  it('should throw on invalid input', () => {
    expect(() => yourFunction(null as any)).toThrow();
  });
  
  it('should throw with specific error message', () => {
    expect(() => yourFunction(invalid)).toThrow('Expected error message');
  });
  
  // Test return types
  it('should return correct type', () => {
    const result = yourFunction(new Date());
    expect(typeof result).toBe('string'); // or 'number', etc.
  });
  
  // Test ranges
  it('should return positive value', () => {
    const result = yourFunction(new Date());
    expect(result).toBeGreaterThan(0);
  });
  
  // Test string output
  it('should contain expected text', () => {
    const result = yourFunction(new Date('2025-01-01'));
    expect(result).toContain('expected');
  });
  
  it('should match pattern', () => {
    const result = yourFunction(new Date());
    expect(result).toMatch(/\d+ days/);
  });
});

// For date parsing tests
describe('parseDate', () => {
  it('should parse valid ISO date', () => {
    const date = parseDate('2025-01-01');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(0); // January is 0
    expect(date.getDate()).toBe(1);
  });
  
  it('should throw on invalid format', () => {
    expect(() => parseDate('01/01/2025')).toThrow('Invalid date');
    expect(() => parseDate('invalid')).toThrow('Invalid date');
    expect(() => parseDate('')).toThrow('Invalid date');
  });
});

// For calculation tests
describe('daysBetween', () => {
  it('should calculate days correctly', () => {
    const date1 = new Date('2025-01-01');
    const date2 = new Date('2025-01-31');
    expect(daysBetween(date1, date2)).toBe(30);
  });
  
  it('should return absolute value', () => {
    const date1 = new Date('2025-01-31');
    const date2 = new Date('2025-01-01');
    expect(daysBetween(date1, date2)).toBe(30);
  });
  
  it('should handle same date', () => {
    const date = new Date('2025-01-01');
    expect(daysBetween(date, date)).toBe(0);
  });
});
