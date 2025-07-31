/**
 * AuthService handles all authentication logic and direct communication with the Supabase backend.
 */
import { supabase } from '../../../lib/supabase';
import type { AuthResponse, User } from '../types/auth';

/**
 * Log in a user using Supabase authentication.
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResponse with user and session token
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
    throw new Error('Login failed due to an unexpected issue.');
  }

  return {
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email!,
    },
    token: data.session.access_token,
  };
}

/**
 * Register a new user using Supabase authentication.
 * @param name - User's name
 * @param email - User's email
 * @param password - User's password
 * @returns An object containing the new user, a token (if available), and a verification flag.
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

  return {
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name || name,
      email: data.user.email!,
    },
    token: data.session?.access_token || '',
    needsVerification: !data.session,
  };
}

/**
 * Resend verification email to the specified email address.
 * @param email - Email address to send verification to
 */
export async function resendVerificationEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get the current user and session from Supabase.
 * @returns A User object if authenticated, otherwise null.
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
  };
}

/**
 * Sign out the current user from Supabase.
 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
