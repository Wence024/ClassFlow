import { z } from 'zod';

/**
 * A reusable schema for required foreign key strings.
 * It preprocesses null/undefined values to empty strings,
 * ensuring that the .min(1) validation provides the error message.
 */
const requiredString = (message: string) =>
  z.preprocess((val) => (val === undefined || val === null ? '' : val), z.string().min(1, message));

/**
 * Schema for validating the Class Session form.
 */
export const classSessionSchema = z.object({
  course_id: requiredString('A course must be selected'),
  class_group_id: requiredString('A class group must be selected'),
  classroom_id: requiredString('A classroom must be selected'),
  instructor_id: requiredString('An instructor must be selected'),
  period_count: z
    .any()
    .superRefine((val, ctx) => {
      // 1. Check for required field
      if (val === null || val === undefined || val === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Number of Periods is required',
        });
        return;
      }

      const num = Number(val);

      // 2. Check for valid number type
      if (isNaN(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be a number',
        });
        return;
      }

      // 3. Check for integer
      if (!Number.isInteger(num)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be a whole number',
        });
        return;
      }

      // 4. Check for minimum value
      if (num <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duration must be at least 1 period',
        });
        return;
      }
    })
    .transform(Number), // Ensure the final output type is a number
});
