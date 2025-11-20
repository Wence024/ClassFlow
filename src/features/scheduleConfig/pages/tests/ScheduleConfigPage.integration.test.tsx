import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScheduleConfigPage from '../ScheduleConfigPage';
import { AuthContext } from '../../../shared/auth/contexts/AuthContext';
import type { AuthContextType } from '../../../shared/auth/types/auth';
import * as useScheduleConfigHook from '../../hooks/useScheduleConfig';

const queryClient = new QueryClient();

const renderPage = (user: {
  id: string;
  role: string;
  program_id: string;
  name: string;
  email: string;
}) => {
  const mockAuthContext: AuthContextType = {
    user,
    loading: false,
    role: user.role,
    departmentId: null,
    login: vi.fn(),
    logout: vi.fn(),
    error: null,
    clearError: vi.fn(),
    updateMyProfile: vi.fn(),
    isAdmin: () => user.role === 'admin',
    isDepartmentHead: () => user.role === 'department_head',
    isProgramHead: () => user.role === 'program_head',
    canManageInstructors: () => user.role === 'admin' || user.role === 'department_head',
    canManageClassrooms: () => user.role === 'admin',
    canReviewRequestsForDepartment: vi.fn().mockReturnValue(false),
    canManageInstructorRow: vi.fn().mockReturnValue(false),
    canManageCourses: vi.fn().mockReturnValue(false),
    canManageAssignmentsForProgram: vi.fn().mockReturnValue(false),
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuthContext}>
        <ScheduleConfigPage />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('ScheduleConfigPage - Admin Access', () => {
  const mockSettings = {
    id: 'config1',
    periods_per_day: 8,
    class_days_per_week: 5,
    start_time: '09:00',
    period_duration_mins: 60,
    created_at: '2023-01-01T00:00:00Z',
    semester_id: 'sem1',
  };
  const mockUpdateSettings = vi.fn().mockResolvedValue(mockSettings);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: mockSettings,
      updateSettings: mockUpdateSettings,
      isLoading: false,
      isUpdating: false,
      error: null,
    });
  });

  it('should handle null settings gracefully for initial setup', async () => {
    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: null,
      updateSettings: mockUpdateSettings,
      isLoading: false,
      isUpdating: false,
      error: null,
    });

    renderPage({ id: 'u1', role: 'admin', program_id: 'p1', name: 'test', email: 'test@test.com' });

    // Should render with default values when settings is null
    await waitFor(() => {
      expect(screen.getByLabelText(/Periods Per Day/i)).toBeEnabled();
      expect(screen.getByLabelText(/Class Days Per Week/i)).toBeEnabled();
      expect(screen.getByRole('button', { name: /Save Settings/i })).toBeInTheDocument();
    });
  });

  it('should display fields as disabled for non-admin users', async () => {
    renderPage({
      id: 'u1',
      role: 'program_head',
      program_id: 'p1',
      name: 'test',
      email: 'test@test.com',
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/Periods Per Day/i)).toBeDisabled();
      expect(screen.getByLabelText(/Class Days Per Week/i)).toBeDisabled();
      expect(screen.getByLabelText(/Start Time/i)).toBeDisabled();
      expect(screen.getByLabelText(/Period Duration \(minutes\)/i)).toBeDisabled();
    });
    expect(screen.queryByRole('button', { name: /Save Settings/i })).not.toBeInTheDocument();
  });

  it('should display fields as enabled for admin users', async () => {
    renderPage({ id: 'u1', role: 'admin', program_id: 'p1', name: 'test', email: 'test@test.com' });
    await waitFor(() => {
      expect(screen.getByLabelText(/Periods Per Day/i)).toBeEnabled();
      expect(screen.getByLabelText(/Class Days Per Week/i)).toBeEnabled();
      expect(screen.getByLabelText(/Start Time/i)).toBeEnabled();
      expect(screen.getByLabelText(/Period Duration \(minutes\)/i)).toBeEnabled();
    });
    expect(screen.getByRole('button', { name: /Save Settings/i })).toBeInTheDocument();
  });

  it('admin user should be able to save settings', async () => {
    renderPage({ id: 'u1', role: 'admin', program_id: 'p1', name: 'test', email: 'test@test.com' });

    const saveButton = await screen.findByRole('button', { name: /Save Settings/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith({
        periods_per_day: 8,
        class_days_per_week: 5,
        start_time: '09:00',
        period_duration_mins: 60,
      });
    });
  });

  it('should prevent saving and show an error if assignments exist outside new bounds', async () => {
    const conflictErrorMessage =
      'Cannot save: 3 class(es) are scheduled outside the new time slots.';
    const mockUpdateSettingsConflict = vi.fn().mockRejectedValue(new Error(conflictErrorMessage));

    vi.spyOn(useScheduleConfigHook, 'useScheduleConfig').mockReturnValue({
      settings: mockSettings,
      updateSettings: mockUpdateSettingsConflict,
      isLoading: false,
      isUpdating: false,
      error: null,
    });

    renderPage({ id: 'u1', role: 'admin', program_id: 'p1', name: 'test', email: 'test@test.com' });

    const saveButton = await screen.findByRole('button', { name: /Save Settings/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateSettingsConflict).toHaveBeenCalled();
      expect(screen.getByText(conflictErrorMessage)).toBeInTheDocument();
    });
  });
});
