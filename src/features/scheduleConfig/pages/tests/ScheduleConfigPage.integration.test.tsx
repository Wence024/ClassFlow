import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScheduleConfigPage from '../ScheduleConfigPage';
import { AuthContext } from '../../../auth/contexts/AuthContext';
import * as useScheduleConfigHook from '../../hooks/useScheduleConfig';

const queryClient = new QueryClient();

const renderPage = (user: { id: string; role: string; program_id: string }) => {
  const mockAuthContext = {
    user,
    loading: false,
    role: user.role,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getStoredUser: vi.fn(),
  } as any;

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

  it('should display fields as disabled for non-admin users', async () => {
    renderPage({ id: 'u1', role: 'program_head', program_id: 'p1' });
    await waitFor(() => {
      expect(screen.getByLabelText(/Periods Per Day/i)).toBeDisabled();
      expect(screen.getByLabelText(/Class Days Per Week/i)).toBeDisabled();
      expect(screen.getByLabelText(/Start Time/i)).toBeDisabled();
      expect(screen.getByLabelText(/Period Duration \(minutes\)/i)).toBeDisabled();
    });
    expect(screen.queryByRole('button', { name: /Save Settings/i })).not.toBeInTheDocument();
  });

  it('should display fields as enabled for admin users', async () => {
    renderPage({ id: 'u1', role: 'admin', program_id: 'p1' });
    await waitFor(() => {
      expect(screen.getByLabelText(/Periods Per Day/i)).toBeEnabled();
      expect(screen.getByLabelText(/Class Days Per Week/i)).toBeEnabled();
      expect(screen.getByLabelText(/Start Time/i)).toBeEnabled();
      expect(screen.getByLabelText(/Period Duration \(minutes\)/i)).toBeEnabled();
    });
    expect(screen.getByRole('button', { name: /Save Settings/i })).toBeInTheDocument();
  });

  it('admin user should be able to save settings', async () => {
    renderPage({ id: 'u1', role: 'admin', program_id: 'p1' });

    const saveButton = await screen.findByRole('button', { name: /Save Settings/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith(mockSettings);
    });
  });
});
