/**
 * @file AuthService handles all authentication logic and direct communication with the Supabase backend.
 * This service abstracts the Supabase API calls, making the rest of the application
 * independent of the specific authentication provider. It also standardizes error handling.
 */
import { supabase } from '../../../lib/supabase';
import type { AuthResponse, User } from '../types/auth';

/**
 * Logs in a user using their email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<AuthResponse>} A promise that resolves to an object containing the user and session token.
 * @throws {Error} Throws a user-friendly error message if login fails.
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let userFriendlyMessage = 'Login failed. Please try again.';
    if (error.message.includes('Invalid login credentials')) {
      userFriendlyMessage =
        'Invalid email or password. Please check your credentials and try again.';
    } else if (error.message.includes('Email not confirmed')) {
      userFriendlyMessage =
        'Please verify your email address before logging in. Check your inbox for a verification link.';
    }
    throw new Error(userFriendlyMessage);
  }

  if (!data.user || !data.session) {
    throw new Error('Login failed due to an unexpected issue. Please try again.');
  }

  return {
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email!,
      role: data.user.user_metadata?.role || 'user',
    },
    token: data.session.access_token,
  };
}

/**
 * Registers a new user with their name, email, and password.
 *
 * @param {string} name - The user's full name.
 * @param {string} email - The user's email address.
 * @param {string} password - The desired password for the new account.
 * @returns {Promise<{ user: User; token: string; needsVerification: boolean }>} A promise that resolves to an object containing the new user, a token (if available), and a flag indicating if email verification is needed.
 * @throws {Error} Throws an error if registration fails.
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string; needsVerification: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Registration failed due to an unexpected issue.');
  }

  // If `data.session` is null, it means Supabase requires email verification.
  const needsVerification = !data.session;

  return {
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name || name,
      email: data.user.email!,
      role: data.user.user_metadata?.role || 'user',
    },
    token: data.session?.access_token || '',
    needsVerification: needsVerification,
  };
}

/**
 * Resends the verification email to the specified email address.
 *
 * @param {string} email - The email address to which the verification link should be sent.
 * @returns {Promise<void>} A promise that resolves when the email has been sent.
 * @throws {Error} Throws an error if the request fails.
 */
export async function resendVerificationEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Retrieves the currently authenticated user from the active session.
 * This is typically used to check for an existing session when the application loads.
 *
 * @returns {Promise<User | null>} A promise that resolves to a User object if a session exists, otherwise null.
 */
export async function getStoredUser(): Promise<User | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session || !session.user) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email!,
    role: session.user.user_metadata?.role || 'user',
  };
}

/**
 * Signs out the currently authenticated user.
 *
 * @returns {Promise<void>} A promise that resolves when the user has been signed out.
 * @throws {Error} Throws an error if sign-out fails.
 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
