import { describe, it, expect } from 'vitest';
import { courseSchema } from '../validation';

describe('courseSchema', () => {
  const baseValidCourse = { name: 'Test Course', code: 'TC101' };

  it('should pass with a valid positive integer for number_of_periods', () => {
    const result = courseSchema.safeParse({ ...baseValidCourse, number_of_periods: 2 });
    expect(result.success).toBe(true);
  });

  it('should correctly parse a valid string number', () => {
    const result = courseSchema.safeParse({ ...baseValidCourse, number_of_periods: '3' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.number_of_periods).toBe(3);
    }
  });

  it('should fail if number_of_periods is zero', () => {
    const result = courseSchema.safeParse({ ...baseValidCourse, number_of_periods: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Duration must be at least 1 period');
    }
  });

  it('should fail if number_of_periods is a negative number', () => {
    const result = courseSchema.safeParse({ ...baseValidCourse, number_of_periods: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Duration must be at least 1 period');
    }
  });

  it('should fail if number_of_periods is not a whole number', () => {
    const result = courseSchema.safeParse({ ...baseValidCourse, number_of_periods: 1.5 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Must be a whole number');
    }
  });

  it('should fail if number_of_periods is a non-numeric string', () => {
    const result = courseSchema.safeParse({ ...baseValidCourse, number_of_periods: 'abc' });
    expect(result.success).toBe(false);
    if (!result.success) {
      // Preprocess now makes this trigger the invalid_type_error.
      expect(result.error.issues[0].message).toBe('Must be a number');
    }
  });

  it('should fail if number_of_periods is missing (undefined)', () => {
    const result = courseSchema.safeParse({ ...baseValidCourse, number_of_periods: undefined });
    expect(result.success).toBe(false);
    if (!result.success) {
      // Preprocess makes this trigger the required_error.
      expect(result.error.issues[0].message).toBe('Number of Periods is required');
    }
  });

  it('should fail if number_of_periods is null', () => {
    const result = courseSchema.safeParse({ ...baseValidCourse, number_of_periods: null });
    expect(result.success).toBe(false);
    if (!result.success) {
      // Preprocess makes this trigger the required_error.
      expect(result.error.issues[0].message).toBe('Number of Periods is required');
    }
  });
});
