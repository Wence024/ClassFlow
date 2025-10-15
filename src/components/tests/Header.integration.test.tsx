import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';
import { AuthContext } from '../../features/auth/contexts/AuthContext';
import { LayoutProvider } from '../../contexts/LayoutContext';
import type { AuthContextType } from '../../features/auth/types/auth';

/**
 * Renders Header with required providers for testing.
 *
 * @param authContextValue - Partial auth context to merge with defaults.
 * @returns The render result from React Testing Library.
 */
const renderHeader = (authContextValue: Partial<AuthContextType> = {}) => {
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
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthContext}>
        <LayoutProvider>
          <Header />
        </LayoutProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Header - Sidebar Toggle Integration', () => {
  it('should render the sidebar toggle button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /toggle sidebar/i })).toBeInTheDocument();
  });

  it('should show collapse icon when sidebar is expanded', () => {
    renderHeader();
    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(toggleButton).toHaveAttribute('title', 'Collapse sidebar');
  });

  it('should toggle icon when button is clicked', async () => {
    const user = userEvent.setup();
    renderHeader();

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(toggleButton).toHaveAttribute('title', 'Collapse sidebar');

    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('title', 'Expand sidebar');

    await user.click(toggleButton);
    expect(toggleButton).toHaveAttribute('title', 'Collapse sidebar');
  });

  it('should render application title and branding', () => {
    renderHeader();
    expect(screen.getByText('ClassFlow')).toBeInTheDocument();
    expect(screen.getByText('Timeline Matrix')).toBeInTheDocument();
  });
});
