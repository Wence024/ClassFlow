import { z } from 'zod';

/** Zod schema for validating Program form data. */
export const programSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120, 'Name is too long'),
  short_code: z.string().min(1, 'Code is required').max(20, 'Code is too long'),
});

export type ProgramFormData = z.infer<typeof programSchema>;
