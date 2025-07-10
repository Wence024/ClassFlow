import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types/auth';
import * as authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load user from service on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await authService.getStoredUser();
        setUser(storedUser);
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        // Clear any invalid stored data
        localStorage.removeItem('authUser');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user } = await authService.login(email, password);
      setUser(user);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setUser(null);
      // Check for email verification errors
      if (
        errorMessage.includes('Email not confirmed') ||
        errorMessage.includes('Email not verified')
      ) {
        navigate('/verify-email');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user, needsVerification } = await authService.register(name, email, password);
      if (needsVerification) {
        setUser(null);
        navigate('/verify-email');
      } else {
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

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err: unknown) {
      console.error('Logout error:', err);
      // Still clear user even if logout fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.resendVerificationEmail(email);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to resend verification email';
      setError(errorMessage);
      throw err; // Re-throw so the component can handle it
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, resendVerificationEmail, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
