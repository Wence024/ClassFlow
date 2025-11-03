import { describe, it, expect } from 'vitest';
import { calculateLoad, getLoadStatus, calculateInstructorLoad } from '../loadCalculationService';

describe('loadCalculationService', () => {
  const config = { unitsPerLoad: 3.0, standardLoad: 7.0 };

  it('calculateLoad divides units by unitsPerLoad', () => {
    expect(calculateLoad(21, config)).toBe(7);
    expect(calculateLoad(0, config)).toBe(0);
    expect(calculateLoad(3, config)).toBe(1);
  });

  it('getLoadStatus returns UNDERLOADED below 90% of standard', () => {
    expect(getLoadStatus(6.2, 7)).toBe('UNDERLOADED');
  });

  it('getLoadStatus returns AT_STANDARD within ±10% of standard', () => {
    expect(getLoadStatus(6.3, 7)).toBe('AT_STANDARD');
    expect(getLoadStatus(7.7, 7)).toBe('AT_STANDARD');
  });

  it('getLoadStatus returns OVERLOADED above 110% of standard', () => {
    expect(getLoadStatus(7.71, 7)).toBe('OVERLOADED');
  });

  it('calculateInstructorLoad returns load, status, and standard', () => {
    const result = calculateInstructorLoad(21, config);
    expect(result.load).toBe(7);
    expect(result.status).toBe('AT_STANDARD');
    expect(result.standardLoad).toBe(7);
  });
});



