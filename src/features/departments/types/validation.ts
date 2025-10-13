import { z } from 'zod';

/** Zod schema for validating Department form data. */
export const departmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120, 'Name is too long'),
  code: z.string().min(1, 'Code is required').max(20, 'Code is too long'),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;


