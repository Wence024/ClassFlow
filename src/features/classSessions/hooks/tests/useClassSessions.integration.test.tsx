import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClassSessions } from '../useClassSessions';
import * as classSessionsService from '../../services/classSessionsService';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import type {
  Course,
  Instructor,
  Classroom,
  ClassGroup,
} from '../../../classSessionComponents/types';
import type { ClassSession } from '../../types/classSession';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider
      value={{
        user: {
          id: 'u1',
          name: 'Test User',
          email: 'test@example.com',
          program_id: 'p1',
          role: 'program_head',
        },
        loading: false,
        role: 'program_head',
        login: vi.fn(),
        logout: vi.fn(),
        error: null,
        clearError: vi.fn(),
      }}
    >
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('useClassSessions - program_id association', () => {
  const mockProgramId = 'p1';
  const mockClassSessionInput = {
    course_id: 'c1',
    class_group_id: 'g1',
    classroom_id: 'r1',
    instructor_id: 'i1',
    period_count: 1,
    user_id: 'u1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const mockCreatedSession: ClassSession = {
      id: 's1',
      ...mockClassSessionInput,
      program_id: mockProgramId,
      course: { id: 'c1', name: 'Test Course', code: 'TC101' } as Course,
      group: { id: 'g1', name: 'Test Group' } as ClassGroup,
      instructor: { id: 'i1', first_name: 'Test', last_name: 'Instructor' } as Instructor,
      classroom: { id: 'r1', name: 'Test Room' } as Classroom,
    };
    vi.spyOn(classSessionsService, 'addClassSession').mockResolvedValue(mockCreatedSession);
    vi.spyOn(classSessionsService, 'getClassSessions').mockResolvedValue([]); // Mock query
  });

  it("should add class session with current user's program_id", async () => {
    const { result } = renderHook(() => useClassSessions(), { wrapper });

    await result.current.addClassSession(mockClassSessionInput);

    expect(classSessionsService.addClassSession).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockClassSessionInput,
        program_id: mockProgramId,
      })
    );
  });

  it('should throw error if user is not assigned to a program', async () => {
    const wrapperNoProgram = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            user: {
              id: 'u1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'program_head',
              program_id: null,
            },
            loading: false,
            role: 'program_head',
            login: vi.fn(),
            logout: vi.fn(),
            error: null,
            clearError: vi.fn(),
          }}
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
