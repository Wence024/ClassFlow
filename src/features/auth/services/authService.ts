/**
 * AuthService handles authentication logic and localStorage persistence.
 * All functions are async to allow easy migration to a real backend.
 */
import { loginApi, registerApi } from '../api/authApi';
import type { AuthResponse, User } from '../types/auth';

/**
 * Log in a user and persist their session in localStorage.
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResponse with user and token
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await loginApi(email, password);
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('authUser', JSON.stringify(response.user));
  return response;
}

/**
 * Register a new user and persist their session in localStorage.
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
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('authUser', JSON.stringify(response.user));
  return response;
}

/**
 * Log out the current user and clear their session from localStorage.
 */
export function logout(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}

/**
 * Get the currently stored user from localStorage, if any.
 * @returns User object or null
 */
export function getStoredUser(): User | null {
  const stored = localStorage.getItem('authUser');
  return stored ? JSON.parse(stored) : null;
}
