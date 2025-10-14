/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import ClassroomTab from '../ClassroomTab';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import * as useClassroomsHook from '../../hooks/useClassrooms';
import * as useDepartmentsHook from '../../../departments/hooks/useDepartments';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../../../../auth/types/auth';
import type { Classroom } from '../../types';
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
  department_id: 'dept-cs', // For prioritization test
  program_id: 'prog-cs',
};

const mockDepartments: Department[] = [
  { id: 'dept-cs', name: 'Computer Science', code: 'CS', created_at: new Date().toISOString(), program_id: 'prog-cs' },
  { id: 'dept-math', name: 'Mathematics', code: 'MATH', created_at: new Date().toISOString(), program_id: 'prog-math' },
];

const mockClassrooms: Classroom[] = [
  { id: 'room-cs', name: 'CS Room', capacity: 50, preferred_department_id: 'dept-cs', color: '#ff0000', code: 'CS101', created_at: '', created_by: 'admin', location: '', department_id: 'dept-cs' },
  { id: 'room-math', name: 'Math Room', capacity: 40, preferred_department_id: 'dept-math', color: '#00ff00', code: 'MA101', created_at: '', created_by: 'admin', location: '', department_id: 'dept-math' },
  { id: 'room-none', name: 'General Room', capacity: 60, preferred_department_id: null, color: '#0000ff', code: 'GEN101', created_at: '', created_by: 'admin', location: '', department_id: null },
];

const TestWrapper = ({ children, user }: { children: ReactNode; user: User | null }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ user, canManageClassrooms: () => user?.role === 'admin' } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('ClassroomTab Integration Tests', () => {
  const mockUpdateClassroom = vi.fn();
  const mockCreateClassroom = vi.fn();
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

      render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={mockProgramHeadUser}>{children}</TestWrapper> });

      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('should disable the creation/edit form', () => {
      render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={mockProgramHeadUser}>{children}</TestWrapper> });

      const fieldset = screen.getByTestId('classroom-form-fieldset');
      expect(fieldset).toBeDisabled();
      expect(screen.getByRole('button', { name: /Create/i })).toBeDisabled();
    });

    it('should display classrooms with a matching preferred department first, followed by a separator', () => {
      // The hook returns prioritized classrooms, so we need to provide them in the correct order
      // CS Room should be first (matches user's dept), then Math and General
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

      render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={mockProgramHeadUser}>{children}</TestWrapper> });

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

      render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={mockAdminUser}>{children}</TestWrapper> });

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should enable the creation/edit form', () => {
      render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={mockAdminUser}>{children}</TestWrapper> });

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

      render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={mockAdminUser}>{children}</TestWrapper> });

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
            preferred_department_id: 'dept-cs',
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

      render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={mockAdminUser}>{children}</TestWrapper> });

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
