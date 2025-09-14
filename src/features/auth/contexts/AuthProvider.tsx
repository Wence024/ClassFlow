import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/auth';
import * as authService from '../services/authService';
import { AuthContext } from './AuthContext';

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
 * @param a The component props.
 * @param a.children The child components that will have access to the authentication context.
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
        setUser(null); // Ensure user state is cleared on error
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Handles user login.
   *
   * @param email The user's email address.
   * @param password The user's password.
   * @returns A Promise that resolves on successful login or rejects on failure.
   */
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await authService.login(email, password);
      setUser(user);
      navigate('/class-sessions'); // Redirect on successful login
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setUser(null);
      // If login fails due to unverified email, navigate to the verification page.
      if (errorMessage.includes('verify your email')) {
        navigate('/verify-email');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles new user registration.
   *
   * @param name The user's name.
   * @param email The user's email address.
   * @param password The user's password.
   * @returns A Promise that resolves on successful registration or rejects on failure.
   */
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user, needsVerification } = await authService.register(name, email, password);
      if (needsVerification) {
        // If email verification is required, guide the user to the verification page.
        setUser(null);
        navigate('/verify-email');
      } else {
        // Otherwise, log them in and redirect.
        setUser(user);
        navigate('/class-sessions');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
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
   * Triggers the resending of a verification email.
   *
   * @param email The user's email address.
   * @returns A Promise that resolves on successful resend or rejects on failure.
   */
  const resendVerificationEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resendVerificationEmail(email);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to resend verification email';
      setError(errorMessage);
      throw err; // Re-throw so the UI component can handle it (e.g., show a notification).
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
    login,
    register,
    logout,
    resendVerificationEmail,
    loading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
