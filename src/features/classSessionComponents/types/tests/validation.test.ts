import { describe, it, expect } from 'vitest';
// Import all the component schemas that are actually defined in the corresponding validation file
import { courseSchema, instructorSchema, classroomSchema, classGroupSchema } from '../validation';

describe('componentSchemas', () => {
  describe('courseSchema', () => {
    it('should fail if name is empty', () => {
      const result = courseSchema.safeParse({ name: '', code: 'C101', program_id: '550e8400-e29b-41d4-a716-446655440000' });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Name is required');
    });

    it('should fail if code is empty', () => {
      const result = courseSchema.safeParse({ name: 'Test Course', code: '', program_id: '550e8400-e29b-41d4-a716-446655440000' });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Course code is required');
    });

    it('should pass with valid data', () => {
      const result = courseSchema.safeParse({ 
        name: 'Test Course', 
        code: 'C101', 
        program_id: '550e8400-e29b-41d4-a716-446655440000',
        color: '#ff0000'
      });
      expect(result.success).toBe(true);
    });
  });

  describe('instructorSchema', () => {
    it('should fail if first_name is empty', () => {
      const result = instructorSchema.safeParse({ first_name: '', last_name: 'Smith' });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('First name is required');
    });

    it('should fail if last_name is empty', () => {
      const result = instructorSchema.safeParse({ first_name: 'John', last_name: '' });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Last name is required');
    });

    it('should fail on an invalid email format', () => {
      const result = instructorSchema.safeParse({
        first_name: 'John',
        last_name: 'Smith',
        email: 'invalid-email',
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Invalid email address');
    });

    it('should pass with valid required data', () => {
      const result = instructorSchema.safeParse({ first_name: 'John', last_name: 'Smith', department_id: 'd15a5238-6b91-4f4b-8a88-ea36930335b5' });
      expect(result.success).toBe(true);
    });
  });

  describe('classroomSchema', () => {
    it('should fail if capacity is a negative number', () => {
      const result = classroomSchema.safeParse({ name: 'Room 101', capacity: -5 });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Cannot be negative');
    });

    it('should pass with valid data', () => {
      const result = classroomSchema.safeParse({ name: 'Room 101', capacity: 30 });
      expect(result.success).toBe(true);
    });
  });

  describe('classGroupSchema', () => {
    it('should fail if name is empty', () => {
      const result = classGroupSchema.safeParse({ name: '', code: 'C101', student_count: 30, program_id: '550e8400-e29b-41d4-a716-446655440000' });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('Name is required');
    });

    it('should pass with valid data', () => {
      const result = classGroupSchema.safeParse({ 
        name: 'Test Group', 
        code: 'GRP1',
        student_count: 30,
        program_id: '550e8400-e29b-41d4-a716-446655440000',
        color: '#ff0000'
      });
      expect(result.success).toBe(true);
    });
  });
});
