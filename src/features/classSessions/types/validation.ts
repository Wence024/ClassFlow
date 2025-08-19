import z from 'zod';

// Schema for the Class Session form
export const classSessionSchema = z.object({
  courseId: z.string().min(1, { message: 'Course must be selected' }),
  groupId: z.string().min(1, { message: 'Class group must be selected' }),
  instructorId: z.string().min(1, { message: 'Instructor must be selected' }),
  classroomId: z.string().min(1, { message: 'Classroom must be selected' }),
});
