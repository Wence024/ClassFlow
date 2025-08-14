import { z } from 'zod';

// Base schema for any component with a name
const baseSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

// Schemas for each specific component type
export const courseSchema = baseSchema.extend({
  code: z.string().min(1, { message: 'Course code is required' }),
  number_of_periods: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: 'Must be a number' })
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val), { message: 'Must be a whole number' })
    .refine((val) => val >= 1, { message: 'Duration must be at least 1 period' }),
});

export const classGroupSchema = baseSchema; // Only needs a name

export const classroomSchema = baseSchema.extend({
  location: z.string().min(1, { message: 'Location is required' }),
});

export const instructorSchema = baseSchema.extend({
  email: z.email({ message: 'A valid email is required' }),
});

// A map to easily access the correct schema in the generic form
export const componentSchemas = {
  course: courseSchema,
  classGroup: classGroupSchema,
  classroom: classroomSchema,
  instructor: instructorSchema,
};

// Schema for the Class Session form
export const classSessionSchema = z.object({
  courseId: z.string().min(1, { message: 'Course must be selected' }),
  groupId: z.string().min(1, { message: 'Class group must be selected' }),
  instructorId: z.string().min(1, { message: 'Instructor must be selected' }),
  classroomId: z.string().min(1, { message: 'Classroom must be selected' }),
});
