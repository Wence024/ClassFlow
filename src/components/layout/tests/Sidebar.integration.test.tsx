import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../Sidebar';
import { AuthContext } from '../../../features/auth/contexts/AuthContext';
import type { AuthContextType } from '../../../features/auth/types/auth';

const renderSidebar = (authContextValue: Partial<AuthContextType>) => {
  const mockAuthContext: AuthContextType = {
    user: null,
    role: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    resendVerificationEmail: vi.fn(),
    loading: false,
    error: null,
    clearError: vi.fn(),
    ...authContextValue,
  };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthContext}>
        <Sidebar />
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
