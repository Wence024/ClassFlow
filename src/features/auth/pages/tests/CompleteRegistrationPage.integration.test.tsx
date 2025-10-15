/* eslint-disable sonarjs/no-hardcoded-passwords */
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CompleteRegistrationPage from '../CompleteRegistrationPage';
import { supabase } from '../../../../lib/supabase';

vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    auth: {
      updateUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CompleteRegistrationPage', () => {
  const TEST_PASSWORD = 'TestPassword123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the complete registration form', () => {
    render(
      <MemoryRouter>
        <CompleteRegistrationPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /complete registration/i })).toBeInTheDocument();
  });

  it('should update full_name in profiles table on successful registration', async () => {
    const user = userEvent.setup();
    const mockUpdateUser = vi.fn().mockResolvedValue({ error: null });
    const mockFrom = vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });

    vi.mocked(supabase.auth.updateUser).mockImplementation(mockUpdateUser);
    vi.mocked(supabase.from).mockImplementation(mockFrom);

    render(
      <MemoryRouter>
        <CompleteRegistrationPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/full name/i);
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /complete registration/i });

    await user.type(nameInput, 'John Doe');
    await user.type(passwordInput, TEST_PASSWORD);
    await user.type(confirmInput, TEST_PASSWORD);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        password: TEST_PASSWORD,
      });
      expect(mockFrom).toHaveBeenCalledWith('profiles');
    });
  });

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CompleteRegistrationPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/full name/i);
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /complete registration/i });

    await user.type(nameInput, 'John Doe');
    await user.type(passwordInput, TEST_PASSWORD);
    await user.type(confirmInput, 'DifferentPass123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should handle update errors gracefully', async () => {
    const user = userEvent.setup();
    const mockUpdateUser = vi.fn().mockResolvedValue({
      error: { message: 'Update failed' },
    });

    vi.mocked(supabase.auth.updateUser).mockImplementation(mockUpdateUser);

    render(
      <MemoryRouter>
        <CompleteRegistrationPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/full name/i);
    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /complete registration/i });

    await user.type(nameInput, 'John Doe');
    await user.type(passwordInput, TEST_PASSWORD);
    await user.type(confirmInput, TEST_PASSWORD);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/update failed/i)).toBeInTheDocument();
    });
  });
});
