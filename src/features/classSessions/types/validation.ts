import { z } from 'zod';

export const classSessionSchema = z.object({
  course_id: z.string({ error: 'A course must be selected' }).min(1, 'A course must be selected'),
  class_group_id: z.string().min(1, 'A class group must be selected'),
  classroom_id: z.string().min(1, 'A classroom must be selected'),
  instructor_id: z.string().min(1, 'An instructor must be selected'),
  period_count: z.coerce.number().int().min(1, 'Duration must be at least 1 period'),
});
