import z from 'zod';

// Schema for the Class Session form
export const classSessionSchema = z.object({
  courseId: z.string().min(1, { message: 'Course must be selected' }),
  groupId: z.string().min(1, { message: 'Class group must be selected' }),
  instructorId: z.string().min(1, { message: 'Instructor must be selected' }),
  classroomId: z.string().min(1, { message: 'Classroom must be selected' }),

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
