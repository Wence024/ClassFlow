import { z } from 'zod';

// --- Reusable Schema Helpers ---
const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color code')
  .nullable()
  .optional();

// --- Component-Specific Schemas ---

export const courseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Course code is required'),
  color: hexColorSchema,
});

export const classGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  student_count: z.coerce
    .number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .nullable()
    .optional(),
  code: z.string().max(10, 'Cannot exceed 10 characters').nullable().optional(),
  color: hexColorSchema,
});

export const classroomSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  capacity: z.coerce
    .number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .nullable()
    .optional(),
  code: z.string().max(10, 'Cannot exceed 10 characters').nullable().optional(),
  color: hexColorSchema,
});

export const instructorSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  prefix: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  suffix: z.string().nullable().optional(),
  code: z.string().max(10, 'Cannot exceed 10 characters').nullable().optional(),
  contract_type: z.string().nullable().optional(),
  email: z.string().email('Invalid email address').or(z.literal('')).nullable().optional(),
  phone: z.string().nullable().optional(),
  color: hexColorSchema,
});

export const componentSchemas = {
  course: courseSchema,
  classGroup: classGroupSchema,
  classroom: classroomSchema,
  instructor: instructorSchema,
};
