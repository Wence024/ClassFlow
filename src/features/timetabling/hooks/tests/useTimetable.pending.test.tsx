/**
 * Tests for useTimetable hook focusing on pending session tracking.
 * Tests the hook's ability to track and expose pending session IDs.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTimetable } from '../useTimetable';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import type { AuthContextType } from '../../../auth/types/auth';
import type { ReactNode } from 'react';

vi.mock('../../../../lib/supabase');
vi.mock('../../services/timetableService');
vi.mock('../../../scheduleConfig/hooks/useScheduleConfig');
vi.mock('../../../scheduleConfig/hooks/useActiveSemester');
vi.mock('../../../classSessionComponents/services/classGroupsService');
vi.mock('../../../programs/hooks/usePrograms');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => {
  const mockAuthValue: Partial<AuthContextType> = {
    user: {
      id: 'user-1',
      program_id: 'program-1',
      role: 'program_head',
      name: 'Test User',
      email: 'test@test.com',
    },
    loading: false,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthValue as AuthContextType}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('useTimetable - Pending Session Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should track pending session IDs from assignments', async () => {
    const { useScheduleConfig } = await import('../../../scheduleConfig/hooks/useScheduleConfig');
    const { useActiveSemester } = await import('../../../scheduleConfig/hooks/useActiveSemester');
    const { usePrograms } = await import('../../../programs/hooks/usePrograms');
    const { getTimetableAssignments } = await import('../../services/timetableService');

    (useScheduleConfig as any).mockReturnValue({
      settings: {
        periods_per_day: 5,
        class_days_per_week: 5,
        start_time: '08:00',
        period_duration_mins: 60,
      },
    });

    (useActiveSemester as any).mockReturnValue({
      data: { id: 'semester-1', name: 'Fall 2024', is_active: true },
    });

    (usePrograms as any).mockReturnValue({
      listQuery: { data: [] },
    });

    (getTimetableAssignments as any).mockResolvedValue([
      {
        id: 'assignment-1',
        class_session_id: 'session-pending-1',
        status: 'pending',
        class_session: { id: 'session-pending-1' },
      },
      {
        id: 'assignment-2',
        class_session_id: 'session-confirmed-1',
        status: 'confirmed',
        class_session: { id: 'session-confirmed-1' },
      },
    ]);

    const { result } = renderHook(() => useTimetable('class-group'), { wrapper });

    await waitFor(() => {
      expect(result.current.pendingSessionIds).toBeDefined();
    });

    expect(result.current.pendingSessionIds?.has('session-pending-1')).toBe(true);
    expect(result.current.pendingSessionIds?.has('session-confirmed-1')).toBe(false);
  });

  it('should return pendingSessionIds set', async () => {
    const { useScheduleConfig } = await import('../../../scheduleConfig/hooks/useScheduleConfig');
    const { useActiveSemester } = await import('../../../scheduleConfig/hooks/useActiveSemester');
    const { usePrograms } = await import('../../../programs/hooks/usePrograms');

    (useScheduleConfig as any).mockReturnValue({
      settings: {
        periods_per_day: 5,
        class_days_per_week: 5,
        start_time: '08:00',
        period_duration_mins: 60,
      },
    });

    (useActiveSemester as any).mockReturnValue({
      data: { id: 'semester-1', name: 'Fall 2024', is_active: true },
    });

    (usePrograms as any).mockReturnValue({
      listQuery: { data: [] },
    });

    const { result } = renderHook(() => useTimetable('class-group'), { wrapper });

    await waitFor(() => {
      expect(result.current.pendingSessionIds).toBeInstanceOf(Set);
    });
  });

  it('should detect cross-dept moves on confirmed sessions', () => {
    const mockSession = {
      id: 'session-1',
      instructor: {
        department_id: 'dept-business',
      },
      classroom: {
        preferred_department_id: null,
      },
      program_id: 'program-cs',
    };

    const mockAssignment = {
      id: 'assignment-1',
      class_session_id: 'session-1',
      status: 'confirmed',
    };

    const userDepartmentId = 'dept-cs';

    const hasCrossDeptResource =
      (mockSession.instructor.department_id && 
       mockSession.instructor.department_id !== userDepartmentId) ||
      (mockSession.classroom.preferred_department_id && 
       mockSession.classroom.preferred_department_id !== userDepartmentId);

    const isCurrentlyConfirmed = mockAssignment.status === 'confirmed';

    expect(hasCrossDeptResource && isCurrentlyConfirmed).toBe(true);
  });

  it('should handle empty assignments array', async () => {
    const { useScheduleConfig } = await import('../../../scheduleConfig/hooks/useScheduleConfig');
    const { useActiveSemester } = await import('../../../scheduleConfig/hooks/useActiveSemester');
    const { usePrograms } = await import('../../../programs/hooks/usePrograms');
    const { getTimetableAssignments } = await import('../../services/timetableService');

    (useScheduleConfig as any).mockReturnValue({
      settings: {
        periods_per_day: 5,
        class_days_per_week: 5,
        start_time: '08:00',
        period_duration_mins: 60,
      },
    });

    (useActiveSemester as any).mockReturnValue({
      data: { id: 'semester-1', name: 'Fall 2024', is_active: true },
    });

    (usePrograms as any).mockReturnValue({
      listQuery: { data: [] },
    });

    (getTimetableAssignments as any).mockResolvedValue([]);

    const { result } = renderHook(() => useTimetable('class-group'), { wrapper });

    await waitFor(() => {
      expect(result.current.pendingSessionIds).toBeDefined();
    });

    expect(result.current.pendingSessionIds?.size).toBe(0);
  });
});
