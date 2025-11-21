/**
 * Centralized service for all authentication operations.
 * Consolidates operations from features/auth/services/authService.ts.
 */

import { supabase } from '../supabase';
import type { User } from '../../types/user';

export type AuthResponse = {
  user: User;
  token: string;
};

/**
 * Logs in a user using their email and password.
 *
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A promise that resolves to the authentication response containing user data and token.
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

  // Fetch program_id, department_id from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('program_id, department_id')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    console.error('Profile fetch error:', profileError);
    throw new Error('Login failed: could not find user profile.');
  }

  // Fetch role from user_roles table
  const { data: roleDataArray, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', data.user.id);

  if (roleError) {
    console.error('Role fetch error:', roleError);
    throw new Error('Login failed: could not fetch user role.');
  }

  const roleData = roleDataArray && roleDataArray.length > 0 ? roleDataArray[0] : null;
  const role = roleData?.role || 'program_head';

  return {
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email!,
      role: role,
      program_id: profile.program_id,
      department_id: profile.department_id,
    },
    token: data.session.access_token,
  };
}

/**
 * Retrieves the currently authenticated user's session.
 *
 * @returns A promise that resolves to the user object or null if no user is authenticated.
 */
export async function getStoredUser(): Promise<User | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session || !session.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('program_id, department_id')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile) {
    console.error('Could not fetch user profile:', profileError);
    return null;
  }

  // Fetch role from user_roles table
  const { data: roleDataArray, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id);

  if (roleError) {
    console.error('Could not fetch user role:', roleError);
    return null;
  }

  const roleData = roleDataArray && roleDataArray.length > 0 ? roleDataArray[0] : null;
  const role = roleData?.role || 'program_head';

  return {
    id: session.user.id,
    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email!,
    role: role,
    program_id: profile.program_id,
    department_id: profile.department_id,
  };
}

/**
 * Signs out the currently authenticated user.
 *
 * @returns A promise that resolves when the user is successfully signed out.
 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Updates the authenticated user's profile metadata.
 *
 * @param update The update object containing profile fields to update.
 * @param update.name The user's updated name.
 * @returns A promise that resolves when the profile is successfully updated.
 */
export async function updateMyProfileRow(update: { name?: string }): Promise<void> {
  const { error } = await supabase.auth.updateUser({ data: { name: update.name } });
  if (error) throw new Error(error.message);
}
