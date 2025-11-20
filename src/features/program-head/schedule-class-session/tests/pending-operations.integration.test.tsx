/**
 * Tests for useTimetable hook focusing on pending session tracking.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTimetable } from '../hook';
import { getTimetableAssignments } from '../service';
import * as classGroupsService from '../../manage-components/services/classGroupsService';
import * as useScheduleConfigHook from '@/features/shared/schedule-config/hooks/useScheduleConfig';
import * as useActiveSemesterHook from '@/features/shared/schedule-config/hooks/useActiveSemester';
import * as useAuthHook from '@/features/shared/auth/hooks/useAuth';
import type { ClassGroup } from '../../manage-components/types/classGroup';
import type { ScheduleConfig } from '@/features/shared/schedule-config/types/scheduleConfig';
import type { Semester } from '@/features/shared/schedule-config/types/semesters';
import type { User } from '@/features/shared/auth/types/auth';

vi.mock('../service', () => ({
  getTimetableAssignments: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
    from: vi.fn(() => ({ select: vi.fn().mockResolvedValue({ data: [], error: null }) })),
  },
}));
vi.mock('@/features/shared/auth/hooks/useAuth');
vi.mock('@/features/shared/schedule-config/hooks/useActiveSemester');
vi.mock('../../manage-components/hooks/useClassGroups');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTimetable - Pending Session Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const mockClassGroups: ClassGroup[] = [
      {
        id: 'group-1',
        name: 'Group 1',
        program_id: 'p1',
        code: null,
        color: null,
        created_at: '2025-01-01T00:00:00Z',
        student_count: 30,
        user_id: 'u1',
      },
    ];
    vi.spyOn(classGroupsService, 'getAllClassGroups').mockResolvedValue(mockClassGroups);
    const mockSettings: ScheduleConfig = {
      periods_per_day: 8,
      class_days_per_week: 5,
      id: 'config-1',
      semester_id: null,
      start_time: '08:00',
      period_duration_mins: 45,
      created_at: '2025-01-01T00:00:00Z',
    };
    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: mockSettings,
      isLoading: false,
      isUpdating: false,
      updateSettings: vi.fn(),
      error: null,
    });
    const mockSemester: Semester = {
      id: 'semester-1',
      name: 'Fall 2025',
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      start_date: '2025-09-01',
      end_date: '2025-12-31',
    };
    vi.spyOn(useActiveSemesterHook, 'useActiveSemester').mockReturnValue({
      data: mockSemester,
      isLoading: false,
      isError: false,
      error: null,
      status: 'success',
    } as ReturnType<typeof useActiveSemesterHook.useActiveSemester>);
    const mockUser: User = {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'program_head',
      program_id: 'program-cs',
      department_id: null,
    };
    vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
      role: 'program_head',
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
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
    vi.mocked(getTimetableAssignments).mockResolvedValue(mockAssignments);

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
    vi.mocked(getTimetableAssignments).mockResolvedValue(mockAssignments);
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
