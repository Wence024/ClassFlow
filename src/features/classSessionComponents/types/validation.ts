/**
 * @file This file contains all Zod schemas for validating the forms used to
 * create and update the core schedulable components (Courses, Instructors, etc.).
 * It centralizes validation logic to ensure consistency across the application.
 */
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
  // FIXED: Changed from z.coerce.number() to a simpler number schema.
  student_count: z.number().int().min(0, 'Cannot be negative').nullable().optional(),
  code: z.string().max(10, 'Cannot exceed 10 characters').nullable().optional(),
  color: hexColorSchema,
});

export const classroomSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  // FIXED: Changed from z.coerce.number() to a simpler number schema.
  capacity: z.number().int().min(0, 'Cannot be negative').nullable().optional(),
  code: z.string().max(10, 'Cannot exceed 10 characters').nullable().optional(),
  color: hexColorSchema,
  preferred_department_id: z.string().uuid().optional().nullable(),
});

export const instructorSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  prefix: z.string().nullable().optional(),
  suffix: z.string().nullable().optional(),
  code: z.string().max(10, 'Cannot exceed 10 characters').nullable().optional(),
  contract_type: z.string().nullable().optional(),
  email: z.string().email('Invalid email address').or(z.literal('')).nullable().optional(),
  phone: z.string().nullable().optional(),
  color: hexColorSchema,
  department_id: z.string().uuid('Department is required').nullable().optional(),
});

export const componentSchemas = {
  course: courseSchema,
  classGroup: classGroupSchema,
  classroom: classroomSchema,
  instructor: instructorSchema,
};
