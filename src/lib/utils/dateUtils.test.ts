import { describe, it, expect } from 'vitest';
import { months } from './dateUtils';

describe('months', () => {
  it('should contain the correct month names', () => {
    const expectedMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    expect(months).toEqual(expectedMonths);
  });
});
