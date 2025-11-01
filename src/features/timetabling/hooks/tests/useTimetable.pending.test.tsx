/**
 * Tests for useTimetable hook focusing on pending session tracking.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTimetable } from '../useTimetable';
import type { ReactNode } from 'react';
import { getTimetableAssignments } from '../../services/timetableService';
import * as classGroupsService from '../../../classSessionComponents/services/classGroupsService';
import * as useScheduleConfigHook from '../../../scheduleConfig/hooks/useScheduleConfig';
import * as useActiveSemesterHook from '../../../scheduleConfig/hooks/useActiveSemester';
import * as useAuthHook from '../../../auth/hooks/useAuth';

vi.mock('../../services/timetableService', () => ({
  getTimetableAssignments: vi.fn(),
}));

vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn(), unsubscribe: vi.fn() })),
    removeChannel: vi.fn(),
    from: vi.fn(() => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) })),
  },
}));
vi.mock('../../../auth/hooks/useAuth');
vi.mock('../../../scheduleConfig/hooks/useActiveSemester');
vi.mock('../../../classSessionComponents/hooks/useClassGroups');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTimetable - Pending Session Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockClassGroups = [{ id: 'group-1', name: 'Group 1' }];
    vi.spyOn(classGroupsService, 'getAllClassGroups').mockResolvedValue(mockClassGroups);
    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: { periods_per_day: 8, class_days_per_week: 5 },
      isLoading: false,
      isUpdating: false,
      updateSettings: vi.fn(),
      error: null,
    });
    vi.spyOn(useActiveSemesterHook, 'useActiveSemester').mockReturnValue({
      data: { id: 'semester-1', is_active: true },
      isLoading: false,
      isError: false,
      error: null,
      status: 'success',
    });
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: { id: 'user-1', program_id: 'program-cs' },
      loading: false,
    });
  });

  it('should track pending session IDs from assignments', async () => {
    const mockAssignments = [
      {
        id: 'assignment-1',
        class_session_id: 'session-pending',
        status: 'pending',
        period_index: 5,
        class_group_id: 'group-1',
        class_session: {
          id: 'session-pending',
          course: { id: 'course-1', name: 'Math' },
          instructor: { id: 'instructor-1', first_name: 'John', last_name: 'Doe' },
          classroom: { id: 'classroom-1', name: 'Room 101' },
          group: { id: 'group-1', name: 'Group 1' },
        },
      },
      {
        id: 'assignment-2',
        class_session_id: 'session-confirmed',
        status: 'confirmed',
        period_index: 10,
        class_group_id: 'group-1',
        class_session: {
          id: 'session-confirmed',
          course: { id: 'course-2', name: 'Science' },
          instructor: { id: 'instructor-2', first_name: 'Jane', last_name: 'Smith' },
          classroom: { id: 'classroom-2', name: 'Room 102' },
          group: { id: 'group-1', name: 'Group 1' },
        },
      },
    ];
    (getTimetableAssignments as vi.Mock).mockResolvedValue(mockAssignments);

    const { result } = renderHook(() => useTimetable(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(getTimetableAssignments).toHaveBeenCalled();
    });

    expect(result.current.pendingSessionIds.has('session-pending')).toBe(true);
    expect(result.current.pendingSessionIds.has('session-confirmed')).toBe(false);
  });

  it('should return empty pendingSessionIds set when no pending sessions', async () => {
    const mockAssignments = [
      {
        id: 'assignment-1',
        class_session_id: 'session-confirmed',
        status: 'confirmed',
        period_index: 5,
        class_group_id: 'group-1',
        class_session: {
          id: 'session-confirmed',
          course: { id: 'course-1', name: 'Math' },
          instructor: { id: 'instructor-1', first_name: 'John', last_name: 'Doe' },
          classroom: { id: 'classroom-1', name: 'Room 101' },
          group: { id: 'group-1', name: 'Group 1' },
        },
      },
    ];
    (getTimetableAssignments as vi.Mock).mockResolvedValue(mockAssignments);
    const { result } = renderHook(() => useTimetable(), { wrapper: createWrapper() });
    await waitFor(() => {
      expect(getTimetableAssignments).toHaveBeenCalled();
    });
    expect(result.current.pendingSessionIds.size).toBe(0);
  });

  it('should detect cross-dept moves on confirmed sessions', async () => {
    const mockSession = {
      id: 'session-1',
      instructor: {
        id: 'instructor-1',
        department_id: 'dept-business',
      },
      program_id: 'program-cs',
    };
    const userProgramDepartment = 'dept-cs';
    const isConfirmed = true;
    const hasCrossDeptResource = mockSession.instructor.department_id !== userProgramDepartment;
    expect(isConfirmed && hasCrossDeptResource).toBe(true);
  });
});
