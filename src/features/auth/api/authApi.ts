/**
 * Supabase authentication API implementation.
 */
import { supabase } from '../../../lib/supabase';
import type { AuthResponse } from '../types/auth';

/**
 * Log in a user using Supabase authentication.
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResponse with user and session
 */
export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user || !data.session) {
    throw new Error('Login failed');
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
 * @returns AuthResponse with user and session
 */
export async function registerApi(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
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

  if (!data.user || !data.session) {
    throw new Error('Registration failed');
  }

  return {
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name || name,
      email: data.user.email!,
    },
    token: data.session.access_token,
  };
}

/**
 * Get the current user session from Supabase.
 * @returns AuthResponse if user is authenticated, null otherwise
 */
export async function getCurrentUser(): Promise<AuthResponse | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  return {
    user: {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email!,
    },
    token: session.access_token,
  };
}

/**
 * Sign out the current user from Supabase.
 */
export async function logoutApi(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}
