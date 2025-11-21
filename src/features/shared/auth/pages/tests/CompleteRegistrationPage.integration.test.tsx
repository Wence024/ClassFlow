
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CompleteRegistrationPage from '../CompleteRegistrationPage';
import { supabase } from '@lib/supabase';

vi.mock('@/integrations/supabase/client', () => ({
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
  const TEST_PASSWORD = 'Aa1!Aa1!Aa1!'; // eslint-disable-line sonarjs/no-hardcoded-passwords -- Test password for integration test

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
    expect(screen.getAllByDisplayValue('')[1]).toBeInTheDocument(); // Password field (second input)
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
    const passwordInput = screen.getAllByDisplayValue('')[1]; // Password field (second input)
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /complete registration/i });

    await user.type(nameInput, 'John Doe');
    await user.type(passwordInput, TEST_PASSWORD);
    await user.type(confirmInput, TEST_PASSWORD);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        data: {
          full_name: 'John Doe',
        },
        password: TEST_PASSWORD,
      });
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
    const passwordInput = screen.getAllByDisplayValue('')[1]; // Password field (second input)
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /complete registration/i });

    await user.type(nameInput, 'John Doe');
    await user.type(passwordInput, TEST_PASSWORD);
    await user.type(confirmInput, 'DifferentPass123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
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
    const passwordInput = screen.getAllByDisplayValue('')[1]; // Password field (second input)
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /complete registration/i });

    await user.type(nameInput, 'John Doe');
    await user.type(passwordInput, TEST_PASSWORD);
    await user.type(confirmInput, TEST_PASSWORD);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to complete registration/i)).toBeInTheDocument();
    });
  });
});
