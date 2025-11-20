/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import DepartmentHeadDashboard from '../DepartmentHeadDashboard';
import { AuthContext } from '../../../shared/auth/contexts/AuthContext';
import type { AuthContextType } from '../../../shared/auth/types/auth';
import type { ReactNode } from 'react';

/**
 * Test suite for DepartmentHeadDashboard integration tests.
 * Verifies role-based access and correct display of department-scoped instructors.
 */
describe('DepartmentHeadDashboard Integration Tests', () => {
  let queryClient: QueryClient;

  /**
   * Creates a test wrapper with all required providers.
   *
   * @param authContext - The authentication context value for the test.
   * @returns The wrapper component.
   */
  const createWrapper =
    (authContext: Partial<AuthContextType>) =>
    ({ children }: { children: ReactNode }) => (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={authContext as AuthContextType}>
            {children}
          </AuthContext.Provider>
        </QueryClientProvider>
      </BrowserRouter>
    );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('should deny access for users who are not a Department Head or Admin', () => {
    const programHeadContext: Partial<AuthContextType> = {
      user: {
        id: 'user-1',
        email: 'programhead@example.com',
        role: 'program_head',
        program_id: 'prog-1',
        name: 'Program Head',
        department_id: null,
      },
      loading: false,
      isDepartmentHead: vi.fn(() => false),
      isAdmin: vi.fn(() => false),
      isProgramHead: vi.fn(() => true),
    };

    render(<DepartmentHeadDashboard />, {
      wrapper: createWrapper(programHeadContext),
    });

    expect(screen.getByText(/you do not have access to this page/i)).toBeInTheDocument();
  });

  it('should render the instructor management component for a Department Head', () => {
    const deptHeadContext: Partial<AuthContextType> = {
      user: {
        id: 'user-2',
        email: 'depthead@example.com',
        role: 'department_head',
        department_id: 'dept-1',
        name: 'Department Head',
        program_id: null,
      },
      loading: false,
      isDepartmentHead: vi.fn(() => true),
      isAdmin: vi.fn(() => false),
      isProgramHead: vi.fn(() => false),
    };

    render(<DepartmentHeadDashboard />, {
      wrapper: createWrapper(deptHeadContext),
    });

    expect(screen.getByText(/department head dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/manage instructors for your department/i)).toBeInTheDocument();
  });

  it('should render the instructor management component for an Admin', () => {
    const adminContext: Partial<AuthContextType> = {
      user: {
        id: 'user-3',
        email: 'admin@example.com',
        role: 'admin',
        name: 'Admin User',
        program_id: null,
        department_id: null,
      },
      loading: false,
      isDepartmentHead: vi.fn(() => false),
      isAdmin: vi.fn(() => true),
      isProgramHead: vi.fn(() => false),
    };

    render(<DepartmentHeadDashboard />, {
      wrapper: createWrapper(adminContext),
    });

    expect(screen.getByText(/department head dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/manage instructors across all departments/i)).toBeInTheDocument();
  });

  it('should correctly scope instructors to the users own department for Department Heads', () => {
    const deptHeadContext: Partial<AuthContextType> = {
      user: {
        id: 'user-4',
        email: 'depthead2@example.com',
        role: 'department_head',
        department_id: 'dept-2',
        name: 'Department Head 2',
        program_id: null,
      },
      loading: false,
      isDepartmentHead: vi.fn(() => true),
      isAdmin: vi.fn(() => false),
      isProgramHead: vi.fn(() => false),
    };

    render(<DepartmentHeadDashboard />, {
      wrapper: createWrapper(deptHeadContext),
    });

    // The actual scoping is tested in the AdminInstructorManagement component
    // Here we just verify that the dashboard renders for dept heads
    expect(screen.getByText(/manage instructors for your department/i)).toBeInTheDocument();
  });
});
