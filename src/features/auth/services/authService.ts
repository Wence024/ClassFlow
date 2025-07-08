/**
 * AuthService handles authentication logic with Supabase backend.
 * All functions are async and integrate with Supabase auth.
 */
import { loginApi, registerApi, getCurrentUser, logoutApi } from '../api/authApi';
import type { AuthResponse, User } from '../types/auth';

/**
 * Log in a user using Supabase authentication.
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResponse with user and token
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await loginApi(email, password);
  // Store user info in localStorage for persistence across page reloads
  localStorage.setItem('authUser', JSON.stringify(response.user));
  return response;
}

/**
 * Register a new user using Supabase authentication.
 * @param name - User's name
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResponse with user and token
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await registerApi(name, email, password);
  // Store user info in localStorage for persistence across page reloads
  localStorage.setItem('authUser', JSON.stringify(response.user));
  return response;
}

/**
 * Log out the current user and clear their session.
 */
export async function logout(): Promise<void> {
  await logoutApi();
  localStorage.removeItem('authUser');
}

/**
 * Get the currently stored user from localStorage or Supabase session.
 * @returns User object or null
 */
export async function getStoredUser(): Promise<User | null> {
  // First try to get from Supabase session
  const currentUser = await getCurrentUser();
  if (currentUser) {
    // Update localStorage with current session
    localStorage.setItem('authUser', JSON.stringify(currentUser.user));
    return currentUser.user;
  }

  // Fallback to localStorage if no active session
  const stored = localStorage.getItem('authUser');
  return stored ? JSON.parse(stored) : null;
}
