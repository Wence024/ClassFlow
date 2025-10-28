import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from '../AppLayout';
import { AuthContext } from '../../../features/auth/contexts/AuthContext';
import type { AuthContextType } from '../../../features/auth/types/auth';

/**
 * Renders AppLayout with required providers for testing.
 *
 * @param authContextValue - Partial auth context to merge with defaults.
 * @returns The render result from React Testing Library.
 */
const renderAppLayout = (authContextValue: Partial<AuthContextType> = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockAuthContext: AuthContextType = {
    user: { id: 'u1', role: 'program_head', program_id: 'p1', name: 'Program Head', email: 'ph@test.com' },
    role: 'admin',
    departmentId: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resendVerificationEmail: vi.fn(),
    loading: false,
    error: null,
    clearError: vi.fn(),
    isAdmin: () => false,
    isDepartmentHead: () => false,
    isProgramHead: () => true,
    canManageInstructors: () => false,
    canManageClassrooms: () => false,
    canReviewRequestsForDepartment: () => false,
    canManageInstructorRow: () => false,
    canManageAssignmentsForProgram: () => false,
    updateMyProfile: vi.fn(),
    ...authContextValue,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/scheduler']}>
        <AuthContext.Provider value={mockAuthContext}>
          <AppLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('AppLayout - Collapsible Sidebar Integration', () => {
  it('should render header, sidebar, and main content', () => {
    renderAppLayout();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should have sidebar collapsed by default', () => {
    renderAppLayout();

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-20');
  });

  it('should toggle sidebar when header button is clicked', async () => {
    const user = userEvent.setup();
    renderAppLayout();

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    const sidebar = screen.getByRole('complementary');

    expect(sidebar).toHaveClass('w-20');

    await user.click(toggleButton);
    expect(sidebar).toHaveClass('w-64');

    await user.click(toggleButton);
    expect(sidebar).toHaveClass('w-20');
  });

  it('should persist sidebar state across navigation', async () => {
    const user = userEvent.setup();
    renderAppLayout();

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    const sidebar = screen.getByRole('complementary');

    await user.click(toggleButton);
    expect(sidebar).toHaveClass('w-64');

    const timetableLink = screen.getByRole('link', { name: /Timetable/i });
    await user.click(timetableLink);

    expect(sidebar).toHaveClass('w-64');
  });
});
