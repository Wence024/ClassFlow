import { z } from 'zod';

/**
 * Schema for validating the Class Session form.
 * This schema ensures all required fields are present and that the period duration is a valid positive integer.
 */
export const classSessionSchema = z.object({
  // For dropdowns, a simple .min(1) check is sufficient and provides a clear error.
  course_id: z.string().min(1, 'A course must be selected'),
  class_group_id: z.string().min(1, 'A class group must be selected'),
  classroom_id: z.string().min(1, 'A classroom must be selected'),
  instructor_id: z.string().min(1, 'An instructor must be selected'),

  /**
   * Validation for the duration field. This chain provides granular error messages:
   * 1. `z.coerce.number()`: Handles the initial conversion from a string (from the form input) to a number.
   *    If the input is not a number (e.g., "abc"), it will throw the `error`.
   * 2. `.int()`: Ensures the number is a whole number.
   * 3. `.min(1)`: Ensures the number is positive.
   */
  period_count: z.coerce
    .number({
      // This is the user-friendly message for when the input isn't a number at all.
      invalid_type_error: 'Duration must be a number',
    })
    .int({ message: 'Duration must be a whole number' })
    .min(1, { message: 'Duration must be at least 1 period' }),
});
