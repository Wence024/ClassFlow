import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthProvider';
import * as authService from '../../services/authService';

// Mock the auth service
vi.mock('../../services/authService', () => ({
  getStoredUser: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  resendVerificationEmail: vi.fn(),
  updateMyProfileRow: vi.fn(),
}));

/**
 * Helper component to test auth context values.
 *
 * @param tc - The test component props.
 * @param tc.onRender - Callback when component renders with auth context.
 * @returns A test component.
 */
const TestComponent = ({ onRender }: { onRender: (ctx: any) => void }) => {
  const ctx = require('../AuthContext').useAuthContext();
  onRender(ctx);
  return <div>Test Component</div>;
};

describe('AuthProvider Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with stored user on mount', async () => {
    const mockUser = {
      id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      program_id: null,
      department_id: null,
    };

    (authService.getStoredUser as any).mockResolvedValue(mockUser);

    let capturedContext: any = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent onRender={(ctx) => (capturedContext = ctx)} />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext.user).toEqual(mockUser);
      expect(capturedContext.loading).toBe(false);
      expect(capturedContext.role).toBe('admin');
    });
  });

  it('should set user to null if no stored session exists', async () => {
    (authService.getStoredUser as any).mockResolvedValue(null);

    let capturedContext: any = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent onRender={(ctx) => (capturedContext = ctx)} />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext.user).toBeNull();
      expect(capturedContext.loading).toBe(false);
    });
  });

  it('should provide correct role-based permission checks', async () => {
    const mockDeptHead = {
      id: 'u2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'department_head',
      program_id: null,
      department_id: 'd1',
    };

    (authService.getStoredUser as any).mockResolvedValue(mockDeptHead);

    let capturedContext: any = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent onRender={(ctx) => (capturedContext = ctx)} />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext.isAdmin()).toBe(false);
      expect(capturedContext.isDepartmentHead()).toBe(true);
      expect(capturedContext.isProgramHead()).toBe(false);
      expect(capturedContext.canManageInstructors()).toBe(true);
      expect(capturedContext.canManageClassrooms()).toBe(false);
      expect(capturedContext.canReviewRequestsForDepartment('d1')).toBe(true);
      expect(capturedContext.canReviewRequestsForDepartment('d2')).toBe(false);
    });
  });

  it('should handle auth initialization errors gracefully', async () => {
    (authService.getStoredUser as any).mockRejectedValue(new Error('Network error'));

    let capturedContext: any = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent onRender={(ctx) => (capturedContext = ctx)} />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext.user).toBeNull();
      expect(capturedContext.loading).toBe(false);
    });
  });

  it('should update user after updateMyProfile is called', async () => {
    const mockUser = {
      id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'program_head',
      program_id: 'p1',
      department_id: null,
    };

    const updatedUser = { ...mockUser, name: 'John Updated' };

    (authService.getStoredUser as any).mockResolvedValue(mockUser);
    (authService.updateMyProfileRow as any).mockResolvedValue(undefined);
    (authService.getStoredUser as any).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedUser);

    let capturedContext: any = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent onRender={(ctx) => (capturedContext = ctx)} />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext.user?.name).toBe('John Doe');
    });

    await capturedContext.updateMyProfile({ name: 'John Updated' });

    await waitFor(() => {
      expect(capturedContext.user?.name).toBe('John Updated');
    });
  });
});
