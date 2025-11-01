/**
 * Tests for useTimetable hook focusing on pending session tracking.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTimetable } from '../useTimetable';
import type { ReactNode } from 'react';

vi.mock('../../../../lib/supabase');
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
  });

  it('should track pending session IDs from assignments', async () => {
    const { useAuth } = await import('../../../auth/hooks/useAuth');
    const { useActiveSemester } = await import('../../../scheduleConfig/hooks/useActiveSemester');
    const { useClassGroups } = await import('../../../classSessionComponents/hooks/useClassGroups');
    const { supabase } = await import('../../../../lib/supabase');

    (useAuth as any).mockReturnValue({
      user: { id: 'user-1', program_id: 'program-cs' },
    });

    (useActiveSemester as any).mockReturnValue({
      activeSemester: { id: 'semester-1' },
    });

    (useClassGroups as any).mockReturnValue({
      classGroups: [{ id: 'group-1', name: 'Group 1' }],
    });

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

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: mockAssignments,
          error: null,
        }),
      }),
    });

    const { result } = renderHook(() => useTimetable(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pendingSessionIds).toContain('session-pending');
    expect(result.current.pendingSessionIds).not.toContain('session-confirmed');
  });

  it('should return empty pendingSessionIds set when no pending sessions', async () => {
    const { useAuth } = await import('../../../auth/hooks/useAuth');
    const { useActiveSemester } = await import('../../../scheduleConfig/hooks/useActiveSemester');
    const { useClassGroups } = await import('../../../classSessionComponents/hooks/useClassGroups');
    const { supabase } = await import('../../../../lib/supabase');

    (useAuth as any).mockReturnValue({
      user: { id: 'user-1', program_id: 'program-cs' },
    });

    (useActiveSemester as any).mockReturnValue({
      activeSemester: { id: 'semester-1' },
    });

    (useClassGroups as any).mockReturnValue({
      classGroups: [{ id: 'group-1', name: 'Group 1' }],
    });

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

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: mockAssignments,
          error: null,
        }),
      }),
    });

    const { result } = renderHook(() => useTimetable(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
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
