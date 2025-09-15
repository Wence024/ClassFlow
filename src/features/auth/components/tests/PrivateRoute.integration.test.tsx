import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivateRoute from '../PrivateRoute';
import { AuthContext } from '../../contexts/AuthContext';
import AppLayout from '../../../../components/layout/AppLayout';

// Mock child components of AppLayout
vi.mock('../../../../components/Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock('../../../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

// Mocking the Notification component from the 'ui' module
vi.mock('../../../../components/ui', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    Notification: () => <div data-testid="notification">Notification</div>,
  };
});

const ClassSessionsPage = () => <div>ClassSessionsPage</div>;
const LoginPage = () => <div>LoginPage</div>;

const queryClient = new QueryClient();

const renderAppRoutes = (authContextValue, initialRoute = '/') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authContextValue}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/class-sessions" element={<ClassSessionsPage />} />
                <Route path="/" element={<Navigate to="/class-sessions" replace />} />
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('PrivateRoute & App Routing', () => {
  it('should redirect to login if not authenticated and trying to access a protected route', async () => {
    renderAppRoutes({ user: null, loading: false }, '/class-sessions');
    await waitFor(() => {
      expect(screen.getByText('LoginPage')).toBeInTheDocument();
    });
  });

  it('should render AppLayout and protected page if authenticated', async () => {
    renderAppRoutes(
      { user: { id: 'u1', role: 'program_head', program_id: 'p1' }, loading: false },
      '/'
    );
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByText('ClassSessionsPage')).toBeInTheDocument();
    });
  });

  it('should show loading spinner during authentication', async () => {
    renderAppRoutes({ user: null, loading: true }, '/class-sessions');
    await waitFor(() => {
      expect(screen.getByText('Authenticating...')).toBeInTheDocument();
    });
  });
});
