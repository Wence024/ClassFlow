import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
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
  const mockAuthContext: AuthContextType = {
    user: { id: 'u1', role: 'admin', program_id: 'p1', name: 'Admin', email: 'admin@test.com' },
    role: 'admin',
    departmentId: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resendVerificationEmail: vi.fn(),
    loading: false,
    error: null,
    clearError: vi.fn(),
    isAdmin: () => true,
    isDepartmentHead: () => false,
    isProgramHead: () => false,
    canManageInstructors: () => false,
    canManageClassrooms: () => false,
    canReviewRequestsForDepartment: () => false,
    canManageInstructorRow: () => false,
    canManageAssignmentsForProgram: () => false,
    updateMyProfile: vi.fn(),
    ...authContextValue,
  };

  return render(
    <MemoryRouter initialEntries={['/scheduler']}>
      <AuthContext.Provider value={mockAuthContext}>
        <AppLayout />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('AppLayout - Collapsible Sidebar Integration', () => {
  it('should render header, sidebar, and main content', () => {
    renderAppLayout();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should have sidebar expanded by default', () => {
    renderAppLayout();

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-64');
  });

  it('should toggle sidebar when header button is clicked', async () => {
    const user = userEvent.setup();
    renderAppLayout();

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    const sidebar = screen.getByRole('complementary');

    expect(sidebar).toHaveClass('w-64');

    await user.click(toggleButton);
    expect(sidebar).toHaveClass('w-20');

    await user.click(toggleButton);
    expect(sidebar).toHaveClass('w-64');
  });

  it('should persist sidebar state across navigation', async () => {
    const user = userEvent.setup();
    renderAppLayout();

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    const sidebar = screen.getByRole('complementary');

    await user.click(toggleButton);
    expect(sidebar).toHaveClass('w-20');

    const timetableLink = screen.getByRole('link', { name: /timetable/i });
    await user.click(timetableLink);

    expect(sidebar).toHaveClass('w-20');
  });
});
