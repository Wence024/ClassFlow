/**
 * Unit tests for Manage Users service layer.
 * Tests the service functions that wrap infrastructure calls.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as infraService from '@/lib/services/userService';

vi.mock('@/lib/services/userService');

const mockedInfra = vi.mocked(infraService);

describe('Manage Users Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchAllUsers', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        {
          id: 'u1',
          full_name: 'John Doe',
          role: 'admin' as const,
          department_id: 'd1',
          program_id: null,
        },
      ];

      mockedInfra.getUsers.mockResolvedValue(mockUsers);

      const result = await service.fetchAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockedInfra.getUsers).toHaveBeenCalled();
    });

    it('should propagate errors from infrastructure layer', async () => {
      const error = new Error('Database error');
      mockedInfra.getUsers.mockRejectedValue(error);

      await expect(service.fetchAllUsers()).rejects.toThrow('Database error');
    });
  });

  describe('removeUser', () => {
    it('should delete a user', async () => {
      mockedInfra.deleteUser.mockResolvedValue(undefined);

      await service.removeUser('u1');

      expect(mockedInfra.deleteUser).toHaveBeenCalledWith('u1');
    });

    it('should handle deletion errors', async () => {
      const error = new Error('User not found');
      mockedInfra.deleteUser.mockRejectedValue(error);

      await expect(service.removeUser('invalid-id')).rejects.toThrow('User not found');
    });
  });

  describe('updateUserProfileData', () => {
    it('should update user role', async () => {
      mockedInfra.updateUserProfile.mockResolvedValue(undefined);

      await service.updateUserProfileData('u1', {
        role: 'department_head',
      });

      expect(mockedInfra.updateUserProfile).toHaveBeenCalledWith('u1', {
        role: 'department_head',
      });
    });

    it('should update user department', async () => {
      mockedInfra.updateUserProfile.mockResolvedValue(undefined);

      await service.updateUserProfileData('u1', {
        departmentId: 'd2',
      });

      expect(mockedInfra.updateUserProfile).toHaveBeenCalledWith('u1', {
        department_id: 'd2',
      });
    });

    it('should update user program', async () => {
      mockedInfra.updateUserProfile.mockResolvedValue(undefined);

      await service.updateUserProfileData('u1', {
        programId: 'p1',
      });

      expect(mockedInfra.updateUserProfile).toHaveBeenCalledWith('u1', {
        program_id: 'p1',
      });
    });

    it('should handle null values correctly', async () => {
      mockedInfra.updateUserProfile.mockResolvedValue(undefined);

      await service.updateUserProfileData('u1', {
        programId: null,
        departmentId: null,
      });

      expect(mockedInfra.updateUserProfile).toHaveBeenCalledWith('u1', {
        program_id: null,
        department_id: null,
      });
    });

    it('should handle update errors', async () => {
      const error = new Error('Permission denied');
      mockedInfra.updateUserProfile.mockRejectedValue(error);

      await expect(
        service.updateUserProfileData('u1', { role: 'admin' })
      ).rejects.toThrow('Permission denied');
    });
  });

  describe('updateUserDisplayName', () => {
    it('should update user display name', async () => {
      mockedInfra.updateUserName.mockResolvedValue(undefined);

      await service.updateUserDisplayName('u1', 'Jane Doe');

      expect(mockedInfra.updateUserName).toHaveBeenCalledWith('u1', 'Jane Doe');
    });

    it('should handle name update errors', async () => {
      const error = new Error('Invalid name');
      mockedInfra.updateUserName.mockRejectedValue(error);

      await expect(service.updateUserDisplayName('u1', '')).rejects.toThrow('Invalid name');
    });
  });
});
