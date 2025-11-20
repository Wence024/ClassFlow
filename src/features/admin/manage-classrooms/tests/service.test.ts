/**
 * Unit tests for Manage Classrooms service layer.
 * Tests the service functions that wrap infrastructure calls.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as infraService from '@/lib/services/classroomService';

vi.mock('@/lib/services/classroomService');

const mockedInfra = vi.mocked(infraService);

describe('Manage Classrooms Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchAllClassrooms', () => {
    it('should fetch all classrooms with department info', async () => {
      const mockClassrooms = [
        {
          id: 'c1',
          name: 'Room 101',
          code: 'R101',
          capacity: 30,
          location: 'Building A',
          preferred_department_id: 'd1',
          preferred_department_name: 'CS Department',
        },
      ];

      mockedInfra.getAllClassrooms.mockResolvedValue(mockClassrooms);

      const result = await service.fetchAllClassrooms();

      expect(result).toEqual(mockClassrooms);
      expect(mockedInfra.getAllClassrooms).toHaveBeenCalled();
    });

    it('should propagate errors from infrastructure layer', async () => {
      const error = new Error('Database error');
      mockedInfra.getAllClassrooms.mockRejectedValue(error);

      await expect(service.fetchAllClassrooms()).rejects.toThrow('Database error');
    });
  });

  describe('createClassroom', () => {
    it('should create a new classroom', async () => {
      const classroomData = {
        name: 'Room 202',
        code: 'R202',
        capacity: 25,
        location: 'Building B',
        preferred_department_id: 'd1',
      };

      const mockCreated = {
        id: 'c2',
        ...classroomData,
        color: null,
        created_by: null,
        created_at: '2024-01-01',
      };

      mockedInfra.addClassroom.mockResolvedValue(mockCreated);

      const result = await service.createClassroom(classroomData);

      expect(result).toEqual(mockCreated);
      expect(mockedInfra.addClassroom).toHaveBeenCalledWith(classroomData);
    });

    it('should handle validation errors', async () => {
      const error = new Error('Code already exists');
      mockedInfra.addClassroom.mockRejectedValue(error);

      await expect(
        service.createClassroom({
          name: 'Test',
          code: 'DUP',
          capacity: 30,
        })
      ).rejects.toThrow('Code already exists');
    });
  });

  describe('modifyClassroom', () => {
    it('should update a classroom', async () => {
      const updates = {
        capacity: 35,
        location: 'Building A - Floor 2',
      };

      const mockUpdated = {
        id: 'c1',
        name: 'Room 101',
        code: 'R101',
        ...updates,
        preferred_department_id: 'd1',
        color: null,
        created_by: null,
        created_at: '2024-01-01',
      };

      mockedInfra.updateClassroom.mockResolvedValue(mockUpdated);

      const result = await service.modifyClassroom('c1', updates);

      expect(result).toEqual(mockUpdated);
      expect(mockedInfra.updateClassroom).toHaveBeenCalledWith('c1', updates);
    });

    it('should propagate update errors', async () => {
      const error = new Error('Classroom not found');
      mockedInfra.updateClassroom.mockRejectedValue(error);

      await expect(service.modifyClassroom('invalid-id', { capacity: 40 })).rejects.toThrow(
        'Classroom not found'
      );
    });
  });

  describe('deleteClassroom', () => {
    it('should delete a classroom', async () => {
      mockedInfra.removeClassroom.mockResolvedValue(undefined);

      await service.deleteClassroom('c1');

      expect(mockedInfra.removeClassroom).toHaveBeenCalledWith('c1');
    });

    it('should handle foreign key constraint errors', async () => {
      const error = new Error('foreign key constraint violation');
      mockedInfra.removeClassroom.mockRejectedValue(error);

      await expect(service.deleteClassroom('c1')).rejects.toThrow('foreign key');
    });
  });
});
