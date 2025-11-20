/**
 * Unit tests for instructor service layer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as instructorService from '@/lib/services/instructorService';
import type { InstructorInsert, InstructorUpdate } from '@/types/instructor';

vi.mock('@/lib/services/instructorService');

describe('Instructor Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchInstructors', () => {
    it('should call getInstructors with correct parameters', async () => {
      const mockInstructors = [
        { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@test.com' },
      ];
      vi.mocked(instructorService.getInstructors).mockResolvedValue(mockInstructors as any);

      const result = await service.fetchInstructors({
        role: 'department_head',
        departmentId: 'dept-1',
      });

      expect(instructorService.getInstructors).toHaveBeenCalledWith({
        role: 'department_head',
        department_id: 'dept-1',
      });
      expect(result).toEqual(mockInstructors);
    });

    it('should handle null department ID for admin', async () => {
      vi.mocked(instructorService.getInstructors).mockResolvedValue([]);

      await service.fetchInstructors({
        role: 'admin',
        departmentId: null,
      });

      expect(instructorService.getInstructors).toHaveBeenCalledWith({
        role: 'admin',
        department_id: null,
      });
    });
  });

  describe('createInstructor', () => {
    it('should create instructor with correct data', async () => {
      const newInstructor: InstructorInsert = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@test.com',
        department_id: 'dept-1',
      };

      const createdInstructor = { id: '2', ...newInstructor };
      vi.mocked(instructorService.addInstructor).mockResolvedValue(createdInstructor as any);

      const result = await service.createInstructor(newInstructor);

      expect(instructorService.addInstructor).toHaveBeenCalledWith(newInstructor);
      expect(result).toEqual(createdInstructor);
    });
  });

  describe('modifyInstructor', () => {
    it('should update instructor with correct parameters', async () => {
      const updateData: InstructorUpdate = {
        first_name: 'John Updated',
      };

      const updatedInstructor = {
        id: '1',
        first_name: 'John Updated',
        last_name: 'Doe',
        email: 'john@test.com',
      };
      vi.mocked(instructorService.updateInstructor).mockResolvedValue(updatedInstructor as any);

      const result = await service.modifyInstructor('1', updateData);

      expect(instructorService.updateInstructor).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedInstructor);
    });
  });

  describe('deleteInstructor', () => {
    it('should delete instructor by ID', async () => {
      vi.mocked(instructorService.removeInstructor).mockResolvedValue();

      await service.deleteInstructor('1');

      expect(instructorService.removeInstructor).toHaveBeenCalledWith('1');
    });

    it('should propagate foreign key errors', async () => {
      vi.mocked(instructorService.removeInstructor).mockRejectedValue(
        new Error('foreign key constraint violation')
      );

      await expect(service.deleteInstructor('1')).rejects.toThrow(
        'foreign key constraint violation'
      );
    });
  });
});
