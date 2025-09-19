import { describe, it, expect } from 'vitest';
import { classSessionSchema } from '../validation';

describe('classSessionSchema', () => {
  // A valid base object for testing the class session form
  const baseValidSession = {
    course_id: 'uuid-course-123',
    instructor_id: 'uuid-instructor-123',
    class_group_id: 'uuid-group-123',
    classroom_id: 'uuid-classroom-123',
  };

  describe('period_count validation', () => {
    it('should pass with a valid positive integer', () => {
      const result = classSessionSchema.safeParse({ ...baseValidSession, period_count: 2 });
      expect(result.success).toBe(true);
    });

    

    it('should fail if period_count is zero', () => {
      const result = classSessionSchema.safeParse({ ...baseValidSession, period_count: 0 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Duration must be at least 1 period');
      }
    });
  });

  describe('foreign key validation', () => {
    it('should fail if course_id is missing', () => {
      const { course_id, ...rest } = baseValidSession; // Omit course_id
      const result = classSessionSchema.safeParse({ ...rest, period_count: 1 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('A course must be selected');
      }
    });
  });
});
