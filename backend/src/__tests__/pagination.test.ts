import { describe, it, expect } from 'vitest';

// Test the pagination clamping logic extracted for unit testing
function clampPagination(rawLimit: string | undefined, rawOffset: string | undefined) {
  const parsedLimit = parseInt(rawLimit as string);
  const parsedOffset = parseInt(rawOffset as string);
  const limit = Number.isNaN(parsedLimit) || parsedLimit < 1 ? 20 : Math.min(parsedLimit, 100);
  const offset = Number.isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset;
  return { limit, offset };
}

describe('Pagination clamping', () => {
  it('defaults to limit=20, offset=0 when undefined', () => {
    const { limit, offset } = clampPagination(undefined, undefined);
    expect(limit).toBe(20);
    expect(offset).toBe(0);
  });

  it('defaults when NaN strings are passed', () => {
    const { limit, offset } = clampPagination('abc', 'xyz');
    expect(limit).toBe(20);
    expect(offset).toBe(0);
  });

  it('clamps limit to 100 max', () => {
    const { limit } = clampPagination('999999', '0');
    expect(limit).toBe(100);
  });

  it('rejects negative limit', () => {
    const { limit } = clampPagination('-5', '0');
    expect(limit).toBe(20);
  });

  it('rejects negative offset', () => {
    const { offset } = clampPagination('10', '-10');
    expect(offset).toBe(0);
  });

  it('accepts valid values', () => {
    const { limit, offset } = clampPagination('50', '25');
    expect(limit).toBe(50);
    expect(offset).toBe(25);
  });

  it('handles zero limit as invalid', () => {
    const { limit } = clampPagination('0', '0');
    expect(limit).toBe(20);
  });

  it('handles empty strings', () => {
    const { limit, offset } = clampPagination('', '');
    expect(limit).toBe(20);
    expect(offset).toBe(0);
  });
});
