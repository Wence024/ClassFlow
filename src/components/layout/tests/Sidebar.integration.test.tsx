import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../Sidebar';
import { AuthContext } from '../../../features/auth/contexts/AuthContext';
import { LayoutProvider } from '../../../contexts/LayoutContext';
import type { AuthContextType } from '../../../features/auth/types/auth';

/**
 * Renders the Sidebar component with required providers for testing.
 *
 * @param authContextValue - Partial auth context to merge with defaults.
 * @returns The render result from React Testing Library.
 */
const renderSidebar = (authContextValue: Partial<AuthContextType>) => {
  const mockAuthContext: AuthContextType = {
    user: null,
    role: null,
    departmentId: null,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
    error: null,
    clearError: vi.fn(),
    isAdmin: () => authContextValue.user?.role === 'admin',
    isDepartmentHead: () => authContextValue.user?.role === 'department_head',
    isProgramHead: () => authContextValue.user?.role === 'program_head',
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
          <Sidebar />
        </LayoutProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Sidebar - Role-based Navigation', () => {
  it('should show "Settings" link for admin users', () => {
    renderSidebar({
      user: { id: 'u1', role: 'admin', program_id: 'p1', name: 'test', email: 'test@test.com' },
      loading: false,
    });
    expect(screen.getByRole('link', { name: /Settings/i })).toBeInTheDocument();
  });

  it('should NOT show "Settings" link for non-admin users', () => {
    renderSidebar({
      user: {
        id: 'u1',
        role: 'program_head',
        program_id: 'p1',
        name: 'test',
        email: 'test@test.com',
      },
      loading: false,
    });
    expect(screen.queryByRole('link', { name: /Settings/i })).not.toBeInTheDocument();
  });

  it('should NOT show "Settings" link for logged out users', () => {
    renderSidebar({ user: null, loading: false });
    expect(screen.queryByRole('link', { name: /Settings/i })).not.toBeInTheDocument();
  });
});
