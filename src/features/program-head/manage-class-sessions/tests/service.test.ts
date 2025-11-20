/**
 * Unit tests for Manage Class Sessions service layer.
 * Tests the service functions that wrap infrastructure calls.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as infraService from '../../../classSessions/services/classSessionsService';

vi.mock('../../../classSessions/services/classSessionsService');

const mockedInfra = vi.mocked(infraService);

describe('Manage Class Sessions Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getClassSessionsForProgram', () => {
    it('should fetch class sessions for a program', async () => {
      const mockSessions = [
        { id: 'session1', program_id: 'p1', period_count: 1 },
      ];

      mockedInfra.getClassSessions.mockResolvedValue(mockSessions);

      const result = await service.getClassSessionsForProgram('p1');

      expect(result).toEqual(mockSessions);
      expect(mockedInfra.getClassSessions).toHaveBeenCalledWith({ program_id: 'p1' });
    });

    it('should propagate errors from infrastructure layer', async () => {
      const error = new Error('Database error');
      mockedInfra.getClassSessions.mockRejectedValue(error);

      await expect(service.getClassSessionsForProgram('p1')).rejects.toThrow('Database error');
    });
  });

  describe('createClassSession', () => {
    it('should create a new class session', async () => {
      const sessionData = {
        course_id: 'c1',
        class_group_id: 'g1',
        instructor_id: 'i1',
        classroom_id: 'r1',
        period_count: 1,
      };

      const mockCreated = { id: 'session1', ...sessionData, program_id: 'p1' };
      mockedInfra.createClassSession.mockResolvedValue(mockCreated);

      const result = await service.createClassSession(sessionData, 'p1', 'user1');

      expect(result).toEqual(mockCreated);
      expect(mockedInfra.createClassSession).toHaveBeenCalledWith({
        ...sessionData,
        program_id: 'p1',
        user_id: 'user1',
      });
    });
  });

  describe('updateClassSession', () => {
    it('should update a class session', async () => {
      const updates = { period_count: 2 };
      const mockUpdated = { id: 'session1', period_count: 2 };

      mockedInfra.updateClassSession.mockResolvedValue(mockUpdated);

      const result = await service.updateClassSession('session1', updates);

      expect(result).toEqual(mockUpdated);
      expect(mockedInfra.updateClassSession).toHaveBeenCalledWith('session1', updates);
    });
  });

  describe('deleteClassSession', () => {
    it('should delete a class session', async () => {
      mockedInfra.deleteClassSession.mockResolvedValue(undefined);

      await service.deleteClassSession('session1');

      expect(mockedInfra.deleteClassSession).toHaveBeenCalledWith('session1');
    });
  });
});
