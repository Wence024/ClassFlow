import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTimetable } from '../useTimetable';
import * as timetableService from '../../services/timetableService';
import * as useActiveSemesterHook from '../../../scheduleConfig/hooks/useActiveSemester';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import * as useClassGroupsHook from '../../../classSessionComponents/hooks/useClassGroups';
import * as useScheduleConfigHook from '../../../scheduleConfig/hooks/useScheduleConfig';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ user: { id: 'u1', program_id: 'p1', role: 'program_head' } }}>
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('useTimetable - semester scope', () => {
  const mockSemesterId = 'sem-active-123';
  const mockAssignments = [
    {
      id: 'a1',
      semester_id: mockSemesterId,
      class_session_id: 's1',
      class_group_id: 'g1',
      period_index: 0,
      class_session: {
        id: 's1',
        course_id: 'c1',
        class_group_id: 'g1',
        classroom_id: 'r1',
        instructor_id: 'i1',
        period_count: 2,
        user_id: 'u1',
        program_id: 'p1',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useActiveSemesterHook, 'useActiveSemester').mockReturnValue({
      data: {
        id: mockSemesterId,
        name: 'Fall 2025',
        is_active: true,
        program_id: 'p1',
        start_date: '2025-09-01',
        end_date: '2025-12-20',
      },
      isLoading: false,
      error: null,
      isFetching: false,
    });
    vi.spyOn(timetableService, 'getTimetableAssignments').mockResolvedValue(mockAssignments);
    vi.spyOn(useClassGroupsHook, 'useClassGroups').mockReturnValue({
      classGroups: [{ id: 'g1', name: 'Group 1', capacity: 30, program_id: 'p1' }],
      isLoading: false,
    });
    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: {
        periods_per_day: 8,
        class_days_per_week: 5,
        start_time: '09:00',
        period_duration_mins: 60,
      },
      isLoading: false,
    });
  });

  it('should call timetableService.getTimetableAssignments with the active semester ID', async () => {
    const { result } = renderHook(() => useTimetable(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(timetableService.getTimetableAssignments).toHaveBeenCalledWith(mockSemesterId);
    expect(result.current.timetable.size).toBeGreaterThan(0);
  });

  it('should pass semester_id to assignClassSessionToTimetable', async () => {
    const mockAssignFn = vi
      .spyOn(timetableService, 'assignClassSessionToTimetable')
      .mockResolvedValue(mockAssignments[0]);
    const mockSession = {
      id: 's1',
      period_count: 1,
      course_id: 'c1',
      class_group_id: 'g1',
      classroom_id: 'r1',
      instructor_id: 'i1',
      user_id: 'u1',
      program_id: 'p1',
    };
    const { result } = renderHook(() => useTimetable(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.assignClassSession('group1', 0, mockSession);

    expect(mockAssignFn).toHaveBeenCalledWith(
      expect.objectContaining({
        semester_id: mockSemesterId,
        class_session_id: mockSession.id,
      })
    );
  });

  it('should pass semester_id to moveClassSessionInTimetable', async () => {
    const mockMoveFn = vi
      .spyOn(timetableService, 'moveClassSessionInTimetable')
      .mockResolvedValue(mockAssignments[0]);
    const mockSession = {
      id: 's1',
      period_count: 1,
      course_id: 'c1',
      class_group_id: 'g1',
      classroom_id: 'r1',
      instructor_id: 'i1',
      user_id: 'u1',
      program_id: 'p1',
    };
    const { result } = renderHook(() => useTimetable(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await result.current.moveClassSession(
      { class_group_id: 'group1', period_index: 0 },
      { class_group_id: 'group1', period_index: 1 },
      mockSession
    );

    expect(mockMoveFn).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.any(Object),
      expect.objectContaining({
        semester_id: mockSemesterId,
        class_session_id: mockSession.id,
      })
    );
  });
});
