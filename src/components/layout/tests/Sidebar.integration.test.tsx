import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../Sidebar';
import { AuthContext } from '../../../features/auth/contexts/AuthContext';

const renderSidebar = (authContextValue) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authContextValue}>
        <Sidebar />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Sidebar - Role-based Navigation', () => {
  it('should show "Settings" link for admin users', () => {
    renderSidebar({ user: { id: 'u1', role: 'admin', program_id: 'p1' }, loading: false });
    expect(screen.getByRole('link', { name: /Settings/i })).toBeInTheDocument();
  });

  it('should NOT show "Settings" link for non-admin users', () => {
    renderSidebar({ user: { id: 'u1', role: 'program_head', program_id: 'p1' }, loading: false });
    expect(screen.queryByRole('link', { name: /Settings/i })).not.toBeInTheDocument();
  });

  it('should NOT show "Settings" link for logged out users', () => {
    renderSidebar({ user: null, loading: false });
    expect(screen.queryByRole('link', { name: /Settings/i })).not.toBeInTheDocument();
  });
});
