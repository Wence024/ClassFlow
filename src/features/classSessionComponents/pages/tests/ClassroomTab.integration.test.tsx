/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import ClassroomTab from '../ClassroomTab';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import * as classroomsService from '../../services/classroomsService';
import * as useClassSessionsHook from '../../../classSessions/hooks/useClassSessions';
import * as useDepartmentsHook from '../../../departments/hooks/useDepartments';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../../../auth/types/auth';
import type { Classroom } from '../../types';
import type { Department } from '../../../departments/types/department';

// Mocks
vi.mock('../../services/classroomsService');
vi.mock('../../../classSessions/hooks/useClassSessions');
vi.mock('../../../departments/hooks/useDepartments');

const mockedClassroomsService = vi.mocked(classroomsService, true);
const mockedUseClassSessions = vi.mocked(useClassSessionsHook, true);
const mockedUseDepartments = vi.mocked(useDepartmentsHook, true);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// Mock Data
const mockDepartments: Department[] = [
  { id: 'dept-a', name: 'Department A', code: 'DEPTA', created_at: '' },
  { id: 'dept-b', name: 'Department B', code: 'DEPTB', created_at: '' },
];

const mockClassrooms: Classroom[] = [
  { id: 'room1', name: 'Room 101', capacity: 30, preferred_department_id: 'dept-a', created_at: '', color: '#fff', code: 'R101', created_by: 'admin', location: null, department_id: null },
  { id: 'room2', name: 'Room 202', capacity: 50, preferred_department_id: 'dept-b', created_at: '', color: '#fff', code: 'R202', created_by: 'admin', location: null, department_id: null },
  { id: 'room3', name: 'Room 303', capacity: 40, preferred_department_id: null, created_at: '', color: '#fff', code: 'R303', created_by: 'admin', location: null, department_id: null },
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

const departmentHeadUser = {
  id: 'user-dh',
  name: 'Department Head',
  email: 'dh@test.com',
  role: 'department_head',
  department_id: 'dept1',
  program_id: null,
};

const mockDepartments = [
  { id: 'dept1', name: 'Computer Science', code: 'CS', created_at: '', created_by: 'admin' },
  { id: 'dept2', name: 'Mathematics', code: 'MATH', created_at: '', created_by: 'admin' },
];

const TestWrapper = ({ children, user }: { children: ReactNode; user: AuthContextType['user'] }) => (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider value={{ user, canManageClassrooms: () => user?.role === 'admin' } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('ClassroomTab Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
    mockedUseClassSessions.useClassSessions.mockReturnValue({
      classSessions: [],
    } as ReturnType<typeof useClassSessionsHook.useClassSessions>);
    mockedUseDepartments.useDepartments.mockReturnValue({
      departments: mockDepartments,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useDepartmentsHook.useDepartments>);
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
    render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={adminUser}>{children}</TestWrapper> });

    await user.click(screen.getByRole('button', { name: /Edit Room 101/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Preferred Department/i)).toBeInTheDocument();
    });
  });

  it('should allow admins to set preferred department', async () => {
    const user = userEvent.setup();
    mockedClassroomsService.getClassrooms.mockResolvedValue([allClassrooms[0]]);
    mockedClassroomsService.updateClassroom.mockImplementation(async (id, data) => ({
      ...allClassrooms[0],
      ...data,
      id,
    } as Classroom));

    render(<ClassroomTab />, { wrapper: ({ children }) => <TestWrapper user={adminUser}>{children}</TestWrapper> });

    // --- Part A: Set a preferred department ---
    await user.click(screen.getByRole('button', { name: /Edit Room 303/i }));

    const preferredDeptSelect = await screen.findByLabelText(/Preferred Department/i);
    await user.click(preferredDeptSelect);
    const listbox = await screen.findByRole('listbox');
    await user.click(within(listbox).getByText('Department A (DEPTA)'));

    await user.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(updateClassroomMock).toHaveBeenCalledWith('room3', 
        expect.objectContaining({
          preferred_department_id: 'dept-a',
        })
      );
    });

    // Click edit button
    const editButtons = screen.getAllByRole('button', { name: /Edit Room 101/i });
    await user.click(editButtons[0]);

    // Form should now be in edit mode
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    });

    // Select a department from the dropdown
    const departmentSelect = screen.getByLabelText(/Preferred Department/i);
    await user.click(departmentSelect);
    
    // Select Computer Science department
    const csOption = await screen.findByText('Computer Science');
    await user.click(csOption);

    // Save the changes
    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockedClassroomsService.updateClassroom).toHaveBeenCalledWith(
        'room1',
        expect.objectContaining({
          preferred_department_id: 'dept1',
        })
      );
    });
  });

  it('should allow admins to clear preferred department by selecting "-- None --"', async () => {
    const user = userEvent.setup();
    const classroomWithDept: Classroom = {
      ...allClassrooms[0],
      preferred_department_id: 'dept1',
    };

    mockedClassroomsService.getClassrooms.mockResolvedValue([classroomWithDept]);
    mockedClassroomsService.updateClassroom.mockImplementation(async (id, data) => ({
      ...classroomWithDept,
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

    // Select "-- None --" option from the dropdown
    const departmentSelect = screen.getByLabelText(/Preferred Department/i);
    await user.click(departmentSelect);
    
    const noneOption = await screen.findByText('-- None --');
    await user.click(noneOption);

    // Save the changes
    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockedClassroomsService.updateClassroom).toHaveBeenCalledWith(
        'room1',
        expect.objectContaining({
          preferred_department_id: null,
        })
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

  it('should render a prioritized list for users with a department ID', async () => {
    const classroomsWithPreferences: Classroom[] = [
      { ...allClassrooms[0], preferred_department_id: 'dept1', name: 'Dept1 Room A' },
      { ...allClassrooms[0], id: 'room3', preferred_department_id: 'dept1', name: 'Dept1 Room B' },
      { ...allClassrooms[1], id: 'room4', preferred_department_id: 'dept2', name: 'Dept2 Room' },
      { ...allClassrooms[1], id: 'room5', preferred_department_id: null, name: 'No Preference Room' },
    ];

    mockedClassroomsService.getClassrooms.mockResolvedValue(classroomsWithPreferences);

    render(<ClassroomTab />, { 
      wrapper: ({ children }) => <TestWrapper user={departmentHeadUser}>{children}</TestWrapper> 
    });

    await waitFor(() => {
      expect(screen.getByText('Dept1 Room A')).toBeInTheDocument();
    });

    // Get all classroom names in order
    const classroomNames = screen.getAllByText(/Room/).map((el) => el.textContent);

    // Assert dept1 classrooms appear first
    expect(classroomNames[0]).toContain('Dept1 Room A');
    expect(classroomNames[1]).toContain('Dept1 Room B');

    // Assert separator is present
    expect(screen.getByText('Other Classrooms')).toBeInTheDocument();

    // Assert other classrooms appear after separator
    expect(screen.getByText('Dept2 Room')).toBeInTheDocument();
    expect(screen.getByText('No Preference Room')).toBeInTheDocument();
  });

  it('should hide Edit/Delete buttons for non-admin roles', async () => {
    mockedClassroomsService.getClassrooms.mockResolvedValue([allClassrooms[0], allClassrooms[1]]);

    render(<ClassroomTab />, { 
      wrapper: ({ children }) => <TestWrapper user={departmentHeadUser}>{children}</TestWrapper> 
    });

    await waitFor(() => {
      expect(screen.getByText('Room 101')).toBeInTheDocument();
      expect(screen.getByText('Room 202')).toBeInTheDocument();
    });

    // Assert Edit and Delete buttons are NOT present for any classroom
    expect(screen.queryByRole('button', { name: /Edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
  });
});