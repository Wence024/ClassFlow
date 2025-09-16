import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTimetable } from '../useTimetable';
import * as timetableService from '../../services/timetableService';
import * as classGroupsService from '../../../classSessionComponents/services/classGroupsService';
import * as useActiveSemesterHook from '../../../scheduleConfig/hooks/useActiveSemester';
import * as useScheduleConfigHook from '../../../scheduleConfig/hooks/useScheduleConfig';
import { AuthContext } from '../../../auth/contexts/AuthContext';

// 1. MOCK THE SERVICE MODULES
vi.mock('../../services/timetableService');
vi.mock('../../../classSessionComponents/services/classGroupsService');

const queryClient = new QueryClient();

// A reusable wrapper to provide all necessary contexts for the hook
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ user: { id: 'u1', program_id: 'p1', role: 'program_head' } }}>
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('useTimetable - semester scope', () => {
  const mockSemesterId = 'sem-active-123';
  const mockAssignments = [{ id: 'a1', semester_id: mockSemesterId, class_session: { id: 'cs1' } }];
  const mockClassGroups = [{ id: 'g1', name: 'Group 1', program_id: 'p1' }];
  const mockSettings = { periods_per_day: 8, class_days_per_week: 5 };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    queryClient.clear(); // Clear the query cache

    // 2. MOCK THE HOOK DEPENDENCIES
    vi.spyOn(useActiveSemesterHook, 'useActiveSemester').mockReturnValue({
      data: { id: mockSemesterId, name: 'Fall 2025', is_active: true },
      isLoading: false,
    } as any);

    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: mockSettings,
      isLoading: false,
    } as any);

    // 3. MOCK THE INTERNAL SERVICE CALLS
    // This is the key fix: We mock the service that the hook's internal useQuery calls.
    vi.spyOn(classGroupsService, 'getAllClassGroups').mockResolvedValue(mockClassGroups);
    vi.spyOn(timetableService, 'getTimetableAssignments').mockResolvedValue(mockAssignments);
  });

  it('should call timetableService.getTimetableAssignments with the active semester ID', async () => {
    const { result } = renderHook(() => useTimetable(), { wrapper });

    // The hook will initially be loading while it fetches groups and assignments.
    // We wait until the assignments query has finished (isFetching is false).
    await waitFor(() => {
      // Vitest's `waitFor` requires the callback to not return a promise that resolves to undefined.
      // A simple truthiness check is a good way to handle this.
      return !result.current.loading;
    });

    // Now that all conditions in the `enabled` flag were met, the service must have been called.
    expect(timetableService.getTimetableAssignments).toHaveBeenCalledWith(mockSemesterId);

    // We can also assert that the hook has processed the data correctly
    expect(result.current.groups).toEqual(mockClassGroups);
    expect(result.current.timetable.size).toBeGreaterThan(0);
  });

  it('should pass semester_id when calling assignClassSessionToTimetable', async () => {
    // Setup a spy on the mutation service function
    const assignSpy = vi
      .spyOn(timetableService, 'assignClassSessionToTimetable')
      .mockResolvedValue({} as any);
    const mockSession = { id: 's1', period_count: 1 };

    const { result } = renderHook(() => useTimetable(), { wrapper });
    await waitFor(() => !result.current.loading);

    // Call the mutation function returned by the hook
    await result.current.assignClassSession('group1', 0, mockSession as any);

    // Assert that the service was called with the correct semester_id
    expect(assignSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        semester_id: mockSemesterId,
        class_session_id: mockSession.id,
      })
    );
  });

  // You can add a similar test for `moveClassSession` here
  it('should pass semester_id when calling moveClassSessionInTimetable', async () => {
    const moveSpy = vi
      .spyOn(timetableService, 'moveClassSessionInTimetable')
      .mockResolvedValue({} as any);
    const mockSession = { id: 's1', period_count: 1 };

    const { result } = renderHook(() => useTimetable(), { wrapper });
    await waitFor(() => !result.current.loading);

    await result.current.moveClassSession(
      { class_group_id: 'g1', period_index: 0 },
      { class_group_id: 'g1', period_index: 1 },
      mockSession as any
    );

    // The `move` service function takes the new assignment object as its last parameter
    expect(moveSpy).toHaveBeenCalledWith(
      expect.any(String), // user.id
      expect.any(Object), // from
      expect.any(Object), // to
      expect.objectContaining({
        // new assignment payload
        semester_id: mockSemesterId,
        class_session_id: mockSession.id,
      })
    );
  });
});
