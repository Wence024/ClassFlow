import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/auth';
import * as authService from '../services/authService';
import { AuthContext } from './AuthContext';
import {
  isAdmin as roleIsAdmin,
  isDepartmentHead as roleIsDepartmentHead,
  isProgramHead as roleIsProgramHead,
  canManageInstructors as roleCanManageInstructors,
  canManageClassrooms as roleCanManageClassrooms,
  canReviewRequestsForDepartment as roleCanReviewRequestsForDepartment,
  canManageAssignmentsForProgram as roleCanManageAssignmentsForProgram,
} from '../utils/permissions';

/**
 * Props for the AuthProvider component.
 */
interface AuthProviderProps {
  /** The child components that will have access to the authentication context. */
  children: ReactNode;
}

/**
 * Provides authentication state and actions to its children.
 *
 * This component manages the user's authentication session, including state for
 * the current user, loading status, and any authentication errors. It also exposes
 * functions to handle login, registration, logout, and other auth-related actions.
 * It should wrap the entire application or the parts that need access to authentication.
 *
 * @param a - The component props.
 * @param a.children - The child components that will have access to the authentication context.
 * @returns The AuthProvider component.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // On initial mount, check for an existing user session.
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await authService.getStoredUser();
        
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Handles user login.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A Promise that resolves on successful login or rejects on failure.
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await authService.login(email, password);
      setUser(user);
      
      // Role-based redirect after login
      if (user.role === 'admin') {
        navigate('/departments');
      } else if (user.role === 'department_head') {
        navigate('/department-head');
      } else {
        navigate('/scheduler');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  /** Handles user logout. */
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err: unknown) {
      console.error('Logout error:', err);
      // Even if the remote logout fails, we clear the session locally.
    } finally {
      setUser(null);
      setLoading(false);
      navigate('/'); // Redirect to home page after logout.
    }
  };

  /**
   * Updates current user's profile in public.profiles and refreshes local user.
   *
   * @param update - An object containing the profile fields to update.
   * @param update.name - The user's new display name.
   */
  const updateMyProfile = async (update: { name?: string }) => {
    setLoading(true);
    setError(null);
    try {
      await authService.updateMyProfileRow(update);
      // Refresh stored user
      const refreshed = await authService.getStoredUser();
      if (refreshed) {
        // Preserve email/role/program/department from profile, overlay name
        setUser({ ...refreshed, name: update.name ?? refreshed.name });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  /** Clears any existing authentication error message. */
  const clearError = () => {
    setError(null);
  };

  const authContextValue = {
    user,
    role: user?.role || null, // Derives the role from the user object
    departmentId: user?.department_id || null,
    login,
    logout,
    updateMyProfile,
    loading,
    error,
    clearError,
    isAdmin: () => roleIsAdmin(user?.role || null),
    isDepartmentHead: () => roleIsDepartmentHead(user?.role || null),
    isProgramHead: () => roleIsProgramHead(user?.role || null),
    canManageInstructors: () => roleCanManageInstructors(user?.role || null),
    canManageClassrooms: () => roleCanManageClassrooms(user?.role || null),
    canReviewRequestsForDepartment: (departmentId: string) =>
      roleCanReviewRequestsForDepartment(user?.role || null, user?.department_id || null, departmentId),
  canManageInstructorRow: (instructorDepartmentId: string) =>
      roleCanManageInstructors(user?.role || null) &&
      roleCanReviewRequestsForDepartment(user?.role || null, user?.department_id || null, instructorDepartmentId),
  canManageAssignmentsForProgram: (programId: string) =>
      roleCanManageAssignmentsForProgram(user?.role || null, user?.program_id || null, programId),
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
