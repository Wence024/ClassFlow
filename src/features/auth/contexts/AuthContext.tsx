import { createContext } from 'react';
import type { AuthContextType } from '../types/auth';

/**
 * React context for managing authentication state.
 *
 * This context provides access to the current user's information, authentication status (loading, error),
 * and methods for logging in, registering, and logging out.
 *
 * The context is initialized with `undefined` and is expected to be provided a value
 * by the `AuthProvider` component. The `useAuth` hook should be used to consume this context.
 *
 * @see AuthProvider
 * @see useAuth
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
