/**
 * AuthService handles authentication logic with Supabase backend.
 * All functions are async and integrate with Supabase auth.
 */
import {
  loginApi,
  registerApi,
  getCurrentUser,
  logoutApi,
  resendVerificationEmailApi,
} from '../api/authApi';
import type { AuthResponse, User } from '../types/auth';

/**
 * Log in a user using Supabase authentication.
 * Supabase client handles secure session storage automatically.
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResponse with user and token
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await loginApi(email, password);
  return response;
}

/**
 * Register a new user using Supabase authentication.
 * If Supabase returns no token, the user must verify their email before logging in.
 * @param name - User's name
 * @param email - User's email
 * @param password - User's password
 * @returns { user, token, needsVerification } - needsVerification is true if email verification is required
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string; needsVerification: boolean }> {
  const response = await registerApi(name, email, password);
  const needsVerification = !response.token;
  return { ...response, needsVerification };
}

/**
 * Log out the current user and clear their secure session.
 */
export async function logout(): Promise<void> {
  await logoutApi();
}

/**
 * Get the currently authenticated user directly from the secure Supabase session.
 * @returns User object or null
 */
export async function getStoredUser(): Promise<User | null> {
  const response = await getCurrentUser();
  return response?.user ?? null;
}

/**
 * Resend verification email to the specified email address.
 * @param email - Email address to send verification to
 */
export async function resendVerificationEmail(email: string): Promise<void> {
  await resendVerificationEmailApi(email);
}
