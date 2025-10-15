import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthProvider';
import * as authService from '../../services/authService';
import { useAuthContext } from '../AuthContext';
import { AuthContextType } from '../../types/auth';

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
const TestComponent = ({
  onRender,
}: {
  onRender: (ctx: AuthContextType) => void;
}) => {
  const ctx = useAuthContext();
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

    vi.mocked(authService.getStoredUser).mockResolvedValue(mockUser);

    let capturedContext: AuthContextType | null = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent
            onRender={(ctx: AuthContextType) => (capturedContext = ctx)}
          />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext?.user).toEqual(mockUser);
      expect(capturedContext?.loading).toBe(false);
      expect(capturedContext?.role).toBe('admin');
    });
  });

  it('should set user to null if no stored session exists', async () => {
    vi.mocked(authService.getStoredUser).mockResolvedValue(null);

    let capturedContext: AuthContextType | null = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent
            onRender={(ctx: AuthContextType) => (capturedContext = ctx)}
          />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext?.user).toBeNull();
      expect(capturedContext?.loading).toBe(false);
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

    vi.mocked(authService.getStoredUser).mockResolvedValue(mockDeptHead);

    let capturedContext: AuthContextType | null = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent
            onRender={(ctx: AuthContextType) => (capturedContext = ctx)}
          />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext?.isAdmin()).toBe(false);
      expect(capturedContext?.isDepartmentHead()).toBe(true);
      expect(capturedContext?.isProgramHead()).toBe(false);
      expect(capturedContext?.canManageInstructors()).toBe(true);
      expect(capturedContext?.canManageClassrooms()).toBe(false);
      expect(capturedContext?.canReviewRequestsForDepartment('d1')).toBe(true);
      expect(capturedContext?.canReviewRequestsForDepartment('d2')).toBe(false);
    });
  });

  it('should handle auth initialization errors gracefully', async () => {
    vi.mocked(authService.getStoredUser).mockRejectedValue(
      new Error('Network error')
    );

    let capturedContext: AuthContextType | null = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent
            onRender={(ctx: AuthContextType) => (capturedContext = ctx)}
          />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext?.user).toBeNull();
      expect(capturedContext?.loading).toBe(false);
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

    vi.mocked(authService.getStoredUser).mockResolvedValue(mockUser);
    vi.mocked(authService.updateMyProfileRow).mockResolvedValue(undefined);
    vi.mocked(authService.getStoredUser)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(updatedUser);

    let capturedContext: AuthContextType | null = null;
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent
            onRender={(ctx: AuthContextType) => (capturedContext = ctx)}
          />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(capturedContext?.user?.name).toBe('John Doe');
    });

    await capturedContext?.updateMyProfile({ name: 'John Updated' });

    await waitFor(() => {
      expect(capturedContext?.user?.name).toBe('John Updated');
    });
  });
});
