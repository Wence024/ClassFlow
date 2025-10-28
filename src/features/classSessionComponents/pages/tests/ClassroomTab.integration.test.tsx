/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import ClassroomManagement from '../ClassroomTab';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import * as useClassroomsHook from '../../hooks/useClassrooms';
import * as useDepartmentsHook from '../../../departments/hooks/useDepartments';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../../../auth/types/auth';
import type { Classroom } from '../../types/classroom';
import type { Department } from '../../../departments/types/department';
import { User } from '../../../auth/types/auth';

// Mocks
vi.mock('../../hooks/useClassrooms');
vi.mock('../../../departments/hooks/useDepartments');

const mockedUseClassrooms = vi.mocked(useClassroomsHook, true);
const mockedUseDepartments = vi.mocked(useDepartmentsHook, true);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// Mock Data
const mockAdminUser: User = {
  id: 'user-admin',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'admin',
  department_id: null,
  program_id: 'prog-admin',
};

const mockProgramHeadUser: User = {
  id: 'user-ph',
  name: 'Program Head',
  email: 'ph@test.com',
  role: 'program_head',
  department_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // For prioritization test
  program_id: 'prog-cs',
};

const mockDepartments: Department[] = [
  { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'Computer Science', code: 'CS', created_at: new Date().toISOString() },
  { id: 'b79a7f26-95b3-4b7b-8c27-8e6a4e9b22c1', name: 'Mathematics', code: 'MATH', created_at: new Date().toISOString() },
];

const mockClassrooms: Classroom[] = [
  { id: 'room-cs', name: 'CS Room', capacity: 50, preferred_department_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', color: '#ff0000', code: 'CS101', created_at: '', created_by: 'admin', location: '' },
  { id: 'room-math', name: 'Math Room', capacity: 40, preferred_department_id: 'b79a7f26-95b3-4b7b-8c27-8e6a4e9b22c1', color: '#00ff00', code: 'MA101', created_at: '', created_by: 'admin', location: '' },
  { id: 'room-none', name: 'General Room', capacity: 60, preferred_department_id: null, color: '#0000ff', code: 'GEN101', created_at: '', created_by: 'admin', location: '' },
];

const TestWrapper = ({ children, user }: { children: ReactNode; user: User | null }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ 
      user, 
      role: user?.role || null,
      departmentId: user?.department_id || null,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      clearError: vi.fn(),
      updateMyProfile: vi.fn(),
      isAdmin: () => user?.role === 'admin',
      isDepartmentHead: () => user?.role === 'department_head',
      isProgramHead: () => user?.role === 'program_head',
      canManageInstructors: () => user?.role === 'admin' || user?.role === 'department_head',
      canManageClassrooms: () => user?.role === 'admin',
      canReviewRequestsForDepartment: vi.fn().mockReturnValue(false),
      canManageInstructorRow: vi.fn().mockReturnValue(false),
      canManageCourses: vi.fn().mockReturnValue(false),
      canManageAssignmentsForProgram: vi.fn().mockReturnValue(false),
    } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('ClassroomTab Integration Tests', () => {
  const mockUpdateClassroom = vi.fn();
  const mockDeleteClassroom = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();

    mockedUseClassrooms.useClassrooms.mockReturnValue({
      classrooms: [],
      isLoading: false,
      isSubmitting: false,
      isRemoving: false,
      error: null,
      addClassroom: vi.fn(),
      updateClassroom: mockUpdateClassroom,
      removeClassroom: mockDeleteClassroom,
    } as unknown as ReturnType<typeof useClassroomsHook.useClassrooms>);

    mockedUseDepartments.useDepartments.mockReturnValue({
      listQuery: {
        data: mockDepartments,
        isLoading: false,
        error: null,
      },
    } as unknown as ReturnType<typeof useDepartmentsHook.useDepartments>);
  });

  // --- Persona: Non-Admin ---
  describe('as a Non-Admin User (Program Head)', () => {
    it('should hide Edit/Delete buttons on classroom cards', () => {
      mockedUseClassrooms.useClassrooms.mockReturnValue({
        classrooms: mockClassrooms,
        isLoading: false,
        isSubmitting: false,
        isRemoving: false,
        error: null,
        addClassroom: vi.fn(),
        updateClassroom: mockUpdateClassroom,
        removeClassroom: vi.fn(),
      } as unknown as ReturnType<typeof useClassroomsHook.useClassrooms>);

      render(<ClassroomManagement />, { wrapper: ({ children }) => <TestWrapper user={mockProgramHeadUser}>{children}</TestWrapper> });

      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('should NOT show the creation/edit form for non-admin users', () => {
      render(<ClassroomManagement />, { wrapper: ({ children }) => <TestWrapper user={mockProgramHeadUser}>{children}</TestWrapper> });

      // Program heads should NOT see the form at all (isManagementView = false in ClassroomTab)
      expect(screen.queryByTestId('classroom-form-fieldset')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Create/i })).not.toBeInTheDocument();
      
      // But they should see the info alert about viewing
      expect(screen.getByText(/You are viewing all available classrooms/i)).toBeInTheDocument();
    });

    it('should display classrooms with a matching preferred department first, followed by a separator', async () => {
      // Set up the mock BEFORE rendering
      mockedUseClassrooms.useClassrooms.mockReturnValue({
        classrooms: [mockClassrooms[0], mockClassrooms[1], mockClassrooms[2]], // CS Room, Math Room, General Room
        isLoading: false,
        isSubmitting: false,
        isRemoving: false,
        error: null,
        addClassroom: vi.fn(),
        updateClassroom: mockUpdateClassroom,
        removeClassroom: vi.fn(),
      } as unknown as ReturnType<typeof useClassroomsHook.useClassrooms>);

      render(<ClassroomManagement />, { wrapper: ({ children }) => <TestWrapper user={mockProgramHeadUser}>{children}</TestWrapper> });

      // Wait for data to load and cards to render with explicit timeout
      await waitFor(
        async () => {
          const allCards = await screen.findAllByRole('article');
          expect(allCards.length).toBeGreaterThan(0);
        },
        { timeout: 3000 }
      );

      const allCards = screen.getAllByRole('article');
      expect(within(allCards[0]).getByText('CS Room')).toBeInTheDocument();

      const separator = screen.getByText('Other Classrooms');
      expect(separator).toBeInTheDocument();

      // Check that the CS room is before the separator and the others are after.
      // The DOM order should be [CS Room, Separator, Math Room, General Room]
      const parent = separator.parentElement!;
      const children = Array.from(parent.children);
      const csIndex = children.findIndex(el => el.textContent?.includes('CS Room'));
      const separatorIndex = children.findIndex(el => el.textContent?.includes('Other Classrooms'));
      const mathIndex = children.findIndex(el => el.textContent?.includes('Math Room'));

      expect(csIndex).toBeLessThan(separatorIndex);
      expect(mathIndex).toBeGreaterThan(separatorIndex);
    });
  });

  // --- Persona: Admin ---
  describe('as an Admin User', () => {
    it('should show Edit/Delete buttons on classroom cards', () => {
      mockedUseClassrooms.useClassrooms.mockReturnValue({
        classrooms: [mockClassrooms[0]],
        isLoading: false,
        isSubmitting: false,
        isRemoving: false,
        error: null,
        addClassroom: vi.fn(),
        updateClassroom: mockUpdateClassroom,
        removeClassroom: vi.fn(),
      } as unknown as ReturnType<typeof useClassroomsHook.useClassrooms>);

      render(<ClassroomManagement />, { wrapper: ({ children }) => <TestWrapper user={mockAdminUser}>{children}</TestWrapper> });

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should enable the creation/edit form', () => {
      render(<ClassroomManagement />, { wrapper: ({ children }) => <TestWrapper user={mockAdminUser}>{children}</TestWrapper> });

      const fieldset = screen.getByTestId('classroom-form-fieldset');
      expect(fieldset).not.toBeDisabled();
    });

    it('should call the update mutation with a department ID when a preferred department is assigned', async () => {
      const user = userEvent.setup();
      mockedUseClassrooms.useClassrooms.mockReturnValue({
        classrooms: [mockClassrooms[2]], // General Room with no preferred dept
        isLoading: false,
        isSubmitting: false,
        isRemoving: false,
        error: null,
        addClassroom: vi.fn(),
        updateClassroom: mockUpdateClassroom,
        removeClassroom: vi.fn(),
      } as unknown as ReturnType<typeof useClassroomsHook.useClassrooms>);

      render(<ClassroomManagement />, { wrapper: ({ children }) => <TestWrapper user={mockAdminUser}>{children}</TestWrapper> });

      await user.click(screen.getByRole('button', { name: /edit/i }));
      
      const select = await screen.findByLabelText(/Preferred Department/i);
      await user.click(select);
      
      const listbox = await screen.findByRole('listbox');
      await user.click(within(listbox).getByText('Computer Science (CS)'));

      await user.click(screen.getByRole('button', { name: /Save Changes/i }));

      await waitFor(() => {
        expect(mockUpdateClassroom).toHaveBeenCalledWith(
          'room-none',
          expect.objectContaining({
            name: 'General Room',
            code: 'GEN101',
            capacity: 60,
            color: '#0000ff',
            preferred_department_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          })
        );
      });
    });

    it('should call the update mutation with null when a preferred department is cleared', async () => {
      const user = userEvent.setup();
      mockedUseClassrooms.useClassrooms.mockReturnValue({
        classrooms: [mockClassrooms[0]], // CS Room with preferred dept
        isLoading: false,
        isSubmitting: false,
        isRemoving: false,
        error: null,
        addClassroom: vi.fn(),
        updateClassroom: mockUpdateClassroom,
        removeClassroom: vi.fn(),
      } as unknown as ReturnType<typeof useClassroomsHook.useClassrooms>);

      render(<ClassroomManagement />, { wrapper: ({ children }) => <TestWrapper user={mockAdminUser}>{children}</TestWrapper> });

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const select = await screen.findByLabelText(/Preferred Department/i);
      await user.click(select);

      const listbox = await screen.findByRole('listbox');
      await user.click(within(listbox).getByText('-- None --'));

      await user.click(screen.getByRole('button', { name: /Save Changes/i }));

      await waitFor(() => {
        expect(mockUpdateClassroom).toHaveBeenCalledWith(
          'room-cs',
          expect.objectContaining({
            preferred_department_id: null,
          })
        );
      });
    });
  });
});
