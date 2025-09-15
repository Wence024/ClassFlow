import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClassSessions } from '../useClassSessions';
import * as classSessionsService from '../../services/classSessionsService';
import { AuthContext } from '../../../auth/contexts/AuthContext';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider
      value={{ user: { id: 'u1', program_id: 'p1', role: 'program_head' }, loading: false }}
    >
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('useClassSessions - program_id association', () => {
  const mockProgramId = 'p1';
  const mockUserId = 'u1';
  const mockClassSessionInput = {
    course_id: 'c1',
    class_group_id: 'g1',
    classroom_id: 'r1',
    instructor_id: 'i1',
    period_count: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(classSessionsService, 'addClassSession').mockResolvedValue({
      id: 's1',
      ...mockClassSessionInput,
      user_id: mockUserId,
      program_id: mockProgramId,
    });
    vi.spyOn(classSessionsService, 'getClassSessions').mockResolvedValue([]); // Mock query
  });

  it("should add class session with current user's program_id", async () => {
    const { result } = renderHook(() => useClassSessions(), { wrapper });

    await result.current.addClassSession(mockClassSessionInput);

    expect(classSessionsService.addClassSession).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockClassSessionInput,
        user_id: mockUserId,
        program_id: mockProgramId,
      })
    );
  });

  it('should throw error if user is not assigned to a program', async () => {
    const wrapperNoProgram = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{ user: { id: 'u1', role: 'program_head', program_id: null }, loading: false }}
        >
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    );
    const { result } = renderHook(() => useClassSessions(), { wrapper: wrapperNoProgram });

    await expect(result.current.addClassSession(mockClassSessionInput)).rejects.toThrow(
      'Cannot create class session: User is not assigned to a program.'
    );
  });
});
