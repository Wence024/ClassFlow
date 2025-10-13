/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import ClassroomTab from '../ClassroomTab';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import * as classroomsService from '../../services/classroomsService';
import * as useClassSessionsHook from '../../../classSessions/hooks/useClassSessions';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../../../auth/types/auth';
import type { Classroom } from '../../types';

// Mocks
vi.mock('../../services/classroomsService');
vi.mock('../../../classSessions/hooks/useClassSessions');

const mockedClassroomsService = vi.mocked(classroomsService, true);
const mockedUseClassSessions = vi.mocked(useClassSessionsHook, true);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// Mock Data
const allClassrooms: Classroom[] = [
  { id: 'room1', name: 'Room 101', capacity: 30, department_id: 'dept1', created_at: '', color: '#fff', code: 'R101', created_by: 'admin', location: null, preferred_department_id: null },
  { id: 'room2', name: 'Room 202', capacity: 50, department_id: 'dept2', created_at: '', color: '#fff', code: 'R202', created_by: 'admin', location: null, preferred_department_id: null },
];

const adminUser = {
  id: 'user-admin',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'admin',
  department_id: null,
  program_id: null,
};

const programHeadUser = {
  id: 'user-ph',
  name: 'Program Head',
  email: 'ph@test.com',
  role: 'program_head',
  department_id: null,
  program_id: 'prog1',
};

const TestWrapper = ({ children, user }: { children: ReactNode; user: AuthContextType['user'] }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ user, canManageClassrooms: () => user?.role === 'admin' } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('ClassroomTab Integration Tests (Admin-Only Management)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
    mockedUseClassSessions.useClassSessions.mockReturnValue({
      classSessions: [],
    } as ReturnType<typeof useClassSessionsHook.useClassSessions>);
  });

  it('should allow Admins to create, update, and delete classrooms', async () => {
    const user = userEvent.setup();
    mockedClassroomsService.getClassrooms.mockResolvedValue([]);
    mockedClassroomsService.addClassroom.mockImplementation(async (classroom) => ({
      ...classroom,
      id: 'new-room',
      created_at: new Date().toISOString(),
    } as Classroom));

    render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={adminUser}>{children}</TestWrapper> });

    // CREATE
    await user.type(screen.getByLabelText(/Classroom Name/i), 'New Auditorium');
    await user.type(screen.getByLabelText(/Capacity/i), '150');
    await user.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => {
      expect(mockedClassroomsService.addClassroom).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Auditorium',
          capacity: 150,
        })
      );
    });
  });

  it('should show all classrooms to all roles (read-only for non-admins)', async () => {
    mockedClassroomsService.getClassrooms.mockResolvedValue(allClassrooms);

    render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={programHeadUser}>{children}</TestWrapper> });

    // Assert both classrooms are visible
    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
      expect(screen.getByText('Room 202')).toBeInTheDocument();
    });

    // Assert form is disabled for non-admins
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeDisabled();
  });

  it('should show "Preferred Department" dropdown for admin users', async () => {
    const user = userEvent.setup();
    mockedClassroomsService.getClassrooms.mockResolvedValue([allClassrooms[0]]);
    mockedClassroomsService.updateClassroom.mockImplementation(async (_id, data) => ({
      ...allClassrooms[0],
      ...data,
    } as Classroom));

    render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={adminUser}>{children}</TestWrapper> });

    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
    });

    // Verify the preferred department field exists in the form
    const preferredDeptLabel = screen.getByText(/Preferred Department/i);
    expect(preferredDeptLabel).toBeInTheDocument();
  });

  it('should allow admin to update a classroom with a preferred department', async () => {
    const user = userEvent.setup();
    const departmentList = [
      { id: 'dept1', name: 'Computer Science', code: 'CS' },
      { id: 'dept2', name: 'Mathematics', code: 'MATH' },
    ];

    mockedClassroomsService.getClassrooms.mockResolvedValue([allClassrooms[0]]);
    mockedClassroomsService.updateClassroom.mockImplementation(async (id, data) => ({
      ...allClassrooms[0],
      ...data,
      id,
    } as Classroom));

    render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={adminUser}>{children}</TestWrapper> });

    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByRole('button', { name: /Edit Room 101/i });
    await user.click(editButtons[0]);

    // Form should now be in edit mode
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    });

    // Update the classroom
    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockedClassroomsService.updateClassroom).toHaveBeenCalledWith(
        'room1',
        expect.any(Object)
      );
    });
  });

  it('should render edit/delete buttons only for admin users', async () => {
    mockedClassroomsService.getClassrooms.mockResolvedValue([allClassrooms[0]]);

    // Render as admin
    const { unmount } = render(<ClassroomTab />, { 
      wrapper: ({ children }) => <TestWrapper user={adminUser}>{children}</TestWrapper> 
    });

    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
    });

    // Assert edit and delete buttons are present for admin
    expect(screen.getByRole('button', { name: /Edit Room 101/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete Room 101/i })).toBeInTheDocument();

    unmount();

    // Render as program head
    mockedClassroomsService.getClassrooms.mockResolvedValue([allClassrooms[0]]);
    render(<ClassroomTab />, { 
      wrapper: ({ children }) => <TestWrapper user={programHeadUser}>{children}</TestWrapper> 
    });

    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
    });

    // Assert edit and delete buttons are NOT present for non-admin
    expect(screen.queryByRole('button', { name: /Edit Room 101/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete Room 101/i })).not.toBeInTheDocument();
  });

  it('should disable the form for non-admin users', async () => {
    mockedClassroomsService.getClassrooms.mockResolvedValue([allClassrooms[0]]);

    render(<ClassroomTab />, { 
      wrapper: ({ children }) => <TestWrapper user={programHeadUser}>{children}</TestWrapper> 
    });

    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
    });

    // Assert form is disabled for non-admins
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeDisabled();

    // Assert Create button is also disabled
    const createButton = screen.getByRole('button', { name: /Create/i });
    expect(createButton).toBeDisabled();
  });
});