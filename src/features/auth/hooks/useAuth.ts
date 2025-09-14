import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../types/auth';

/**
 * Custom hook for accessing the authentication context.
 *
 * This hook provides a convenient way to access the current authentication state
 * (user, loading, error) and authentication actions (login, logout, etc.)
 * from any component within the `AuthProvider`.
 *
 * @example
 * const { user, login, logout } = useAuth();
 * @returns The authentication context value.
 * @throws {Error} If used outside of a component wrapped by `AuthProvider`.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
