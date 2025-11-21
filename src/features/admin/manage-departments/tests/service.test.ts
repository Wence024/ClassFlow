/**
 * Unit tests for Manage Departments service layer.
 * Tests the service functions that wrap infrastructure calls.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as infraService from '@/lib/services/departmentService';

vi.mock('@/lib/services/departmentService');

const mockedInfra = vi.mocked(infraService);

describe('Manage Departments Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchDepartments', () => {
    it('should fetch all departments', async () => {
      const mockDepartments = [
        {
          id: 'd1',
          name: 'Computer Science',
          code: 'CS',
          created_at: '2024-01-01',
        },
      ];

      mockedInfra.listDepartments.mockResolvedValue(mockDepartments);

      const result = await service.fetchDepartments();

      expect(result).toEqual(mockDepartments);
      expect(mockedInfra.listDepartments).toHaveBeenCalled();
    });

    it('should propagate errors from infrastructure layer', async () => {
      const error = new Error('Database error');
      mockedInfra.listDepartments.mockRejectedValue(error);

      await expect(service.fetchDepartments()).rejects.toThrow('Database error');
    });
  });

  describe('createNewDepartment', () => {
    it('should create a new department', async () => {
      const departmentData = {
        name: 'Mathematics',
        code: 'MATH',
      };

      const mockCreated = {
        id: 'd2',
        ...departmentData,
        created_at: '2024-01-02',
      };

      mockedInfra.createDepartment.mockResolvedValue(mockCreated);

      const result = await service.createNewDepartment(departmentData);

      expect(result).toEqual(mockCreated);
      expect(mockedInfra.createDepartment).toHaveBeenCalledWith(departmentData);
    });

    it('should handle unique constraint errors', async () => {
      const error = new Error('duplicate key value violates unique constraint');
      mockedInfra.createDepartment.mockRejectedValue(error);

      await expect(
        service.createNewDepartment({
          name: 'Test',
          code: 'DUP',
        })
      ).rejects.toThrow('duplicate key');
    });
  });

  describe('updateDepartmentData', () => {
    it('should update a department', async () => {
      const updates = {
        name: 'Computer Science & Engineering',
      };

      const mockUpdated = {
        id: 'd1',
        name: 'Computer Science & Engineering',
        code: 'CS',
        created_at: '2024-01-01',
      };

      mockedInfra.updateDepartment.mockResolvedValue(mockUpdated);

      const result = await service.updateDepartmentData('d1', updates);

      expect(result).toEqual(mockUpdated);
      expect(mockedInfra.updateDepartment).toHaveBeenCalledWith('d1', updates);
    });

    it('should propagate update errors', async () => {
      const error = new Error('Department not found');
      mockedInfra.updateDepartment.mockRejectedValue(error);

      await expect(service.updateDepartmentData('invalid-id', { name: 'Test' })).rejects.toThrow(
        'Department not found'
      );
    });
  });

  describe('removeDepartment', () => {
    it('should delete a department', async () => {
      mockedInfra.deleteDepartment.mockResolvedValue(undefined);

      await service.removeDepartment('d1');

      expect(mockedInfra.deleteDepartment).toHaveBeenCalledWith('d1');
    });

    it('should handle foreign key constraint errors', async () => {
      const error = new Error('foreign key constraint violation');
      mockedInfra.deleteDepartment.mockRejectedValue(error);

      await expect(service.removeDepartment('d1')).rejects.toThrow('foreign key');
    });
  });
});
