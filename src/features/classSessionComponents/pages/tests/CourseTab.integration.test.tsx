import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CourseManagement from '../CourseTab';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import type { AuthContextType } from '../../../auth/types/auth';
import * as courseHooks from '../../hooks/useCourses';
import * as sessionHooks from '../../../classSessions/hooks/useClassSessions';

// Mock the hooks to control their return values
const mockCourses = [
  {
    id: 'c1',
    name: 'React Fundamentals',
    code: 'R101',
    user_id: 'u1',
    created_at: '',
    color: '#4f46e5',
    program_id: 'p1',
  },
  {
    id: 'c2',
    name: 'Advanced TypeScript',
    code: 'TS201',
    user_id: 'u1',
    created_at: '',
    color: '#0d9488',
    program_id: 'p1',
  },
];

vi.spyOn(courseHooks, 'useCourses').mockReturnValue({
  courses: mockCourses,
  isLoading: false,
  error: null,
  // Mock mutation functions
  addCourse: vi.fn().mockResolvedValue({}),
  updateCourse: vi.fn().mockResolvedValue({}),
  removeCourse: vi.fn().mockResolvedValue(undefined),
  isSubmitting: false,
  isRemoving: false,
});

type UseClassSessionsReturn = ReturnType<typeof sessionHooks.useClassSessions>;
vi.spyOn(sessionHooks, 'useClassSessions').mockReturnValue({
  classSessions: [], // Assume no sessions are using these courses for deletion tests
  // Mock other return values as needed
} as unknown as UseClassSessionsReturn);

const queryClient = new QueryClient();


// A helper to render the component with all necessary providers
const renderComponent = () => {
  const authContextValue: AuthContextType = {
    user: { id: 'u1', name: 'test', email: 'test@test.com', role: 'admin', program_id: 'p1' },
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resendVerificationEmail: vi.fn(),
    error: null,
    clearError: vi.fn(),
    role: 'admin',
  };
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authContextValue}>
        <CourseManagement />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('CourseTab (CourseManagement)', () => {
  it('should render the list of courses', () => {
    renderComponent();
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
  });

  it('should filter the list of courses when a user types in the search bar', async () => {
    renderComponent();

    const searchInput = screen.getByLabelText('Search Courses');
    fireEvent.change(searchInput, { target: { value: 'React' } });

    await waitFor(() => {
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      expect(screen.queryByText('Advanced TypeScript')).not.toBeInTheDocument();
    });
  });

  it('should populate the form when the edit button is clicked', async () => {
    renderComponent();

    // 1. Find the specific edit button for "React Fundamentals"
    const editButton = screen.getByRole('button', { name: /Edit React Fundamentals/i });

    // 2. Click the button to trigger the state update
    fireEvent.click(editButton);

    // 3. THIS IS THE FIX: Wait for the form's title to change to "Edit Course".
    //    `findByRole` is an async query that will wait for the element to appear.
    //    This ensures the component has re-rendered into edit mode before we proceed.
    await screen.findByRole('heading', { name: /Edit Course/i });

    // 4. Now that we know the form is ready, we can safely query for the populated fields.
    const nameInput = screen.getByLabelText(/Course Name/i); // Use regex for flexibility
    const codeInput = screen.getByLabelText(/Course Code/i);

    expect(nameInput).toHaveValue('React Fundamentals');
    expect(codeInput).toHaveValue('R101');
  });
});
