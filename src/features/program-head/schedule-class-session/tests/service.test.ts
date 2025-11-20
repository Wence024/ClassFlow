/**
 * Unit tests for Schedule Class Session service layer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as service from '../service';
import * as timetableService from '@/lib/services/timetableService';

vi.mock('@/lib/services/timetableService');

describe('Schedule Class Session Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('assignSession', () => {
    it('should call timetableService with correct parameters', async () => {
      const params = {
        classSessionId: 'session-1',
        classGroupId: 'group-1',
        periodIndex: 5,
        status: 'confirmed' as const,
      };
      const userId = 'user-1';
      const semesterId = 'semester-1';

      vi.mocked(timetableService.assignClassSessionToTimetable).mockResolvedValue();

      await service.assignSession(params, userId, semesterId);

      expect(timetableService.assignClassSessionToTimetable).toHaveBeenCalledWith(
        {
          class_session_id: 'session-1',
          class_group_id: 'group-1',
          period_index: 5,
          user_id: userId,
          semester_id: semesterId,
        },
        'confirmed'
      );
    });

    it('should handle errors from timetableService', async () => {
      const params = {
        classSessionId: 'session-1',
        classGroupId: 'group-1',
        periodIndex: 5,
        status: 'confirmed' as const,
      };

      vi.mocked(timetableService.assignClassSessionToTimetable).mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.assignSession(params, 'user-1', 'semester-1')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('moveSession', () => {
    it('should call moveClassSession with correct cell parameters', async () => {
      const params = {
        classSessionId: 'session-1',
        fromClassGroupId: 'group-1',
        fromPeriodIndex: 5,
        toClassGroupId: 'group-2',
        toPeriodIndex: 10,
      };
      const userId = 'user-1';
      const semesterId = 'semester-1';

      vi.mocked(timetableService.moveClassSession).mockResolvedValue();

      await service.moveSession(params, userId, semesterId);

      expect(timetableService.moveClassSession).toHaveBeenCalledWith(
        {
          class_group_id: 'group-1',
          period_index: 5,
          semester_id: semesterId,
        },
        {
          class_group_id: 'group-2',
          period_index: 10,
          semester_id: semesterId,
        },
        'session-1',
        userId
      );
    });
  });

  describe('removeSession', () => {
    it('should call removeClassSessionFromTimetable with correct parameters', async () => {
      const params = {
        classGroupId: 'group-1',
        periodIndex: 5,
      };
      const semesterId = 'semester-1';

      vi.mocked(timetableService.removeClassSessionFromTimetable).mockResolvedValue();

      await service.removeSession(params, semesterId);

      expect(timetableService.removeClassSessionFromTimetable).toHaveBeenCalledWith(
        'group-1',
        5,
        semesterId
      );
    });
  });

  describe('fetchTimetableAssignments', () => {
    it('should fetch assignments for a semester', async () => {
      const mockAssignments = [
        { id: 'a1', class_session_id: 'session-1', period_index: 5 },
        { id: 'a2', class_session_id: 'session-2', period_index: 10 },
      ];

      vi.mocked(timetableService.getTimetableAssignments).mockResolvedValue(
        mockAssignments as any
      );

      const result = await service.fetchTimetableAssignments('semester-1');

      expect(result).toEqual(mockAssignments);
      expect(timetableService.getTimetableAssignments).toHaveBeenCalledWith('semester-1');
    });
  });
});
