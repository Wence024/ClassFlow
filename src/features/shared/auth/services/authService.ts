/**
 * @file AuthService handles all authentication logic and direct communication with the Supabase backend.
 * This service abstracts the Supabase API calls, making the rest of the application
 * independent of the specific authentication provider. It also standardizes error handling.
 */
import { supabase } from '@/lib/supabase';
import type { AuthResponse, User } from '../types/auth';
import { UserRole } from '@/features/users/types/user';

/**
 * Logs in a user using their email and password.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to an object containing the user and session token.
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
  const role = (roleData as UserRole)?.role || 'program_head';

  return {
    user: {
      id: data.user.id,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email!,
      role: role || 'program_head',
      program_id: profile.program_id,
      department_id: profile.department_id,
    },
    token: data.session.access_token,
  };
}

/**
 * Retrieves the currently authenticated user's session and enriches it with data from the `profiles` table.
 *
 * It first checks for an active Supabase session. If one exists, it then queries the `public.profiles` table
 * to fetch essential application-specific data like the user's role and assigned program. This is the primary
 * method for initializing the user's state when the application loads.
 *
 * @returns A promise that resolves to a fully-hydrated User object (including role and program_id) if a session and profile exist, otherwise null.
 */
export async function getStoredUser(): Promise<User | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session || !session.user) {
    return null;
  }

  // Instead of relying on metadata, we query the definitive profiles table.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('program_id, department_id')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile) {
    // Handle case where profile might not exist yet or an error occurred
    console.error('Could not fetch user profile:', profileError);
    return null; // Or return a default user object
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
  const role = (roleData as UserRole)?.role || 'program_head';

  return {
    id: session.user.id,
    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email!,
    role: role || 'program_head',
    program_id: profile.program_id,
    department_id: profile.department_id,
  };
}
/**
 * Signs out the currently authenticated user.
 *
 * @returns A promise that resolves when the user has been signed out.
 * @throws {Error} Throws an error if sign-out fails.
 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Updates the authenticated user's profile metadata (e.g., display name).
 * This updates Supabase auth user metadata, not the public.profiles row.
 *
 * @param update - An object containing profile fields to update.
 * @param update.name - The user's new display name.
 */
export async function updateMyProfileRow(update: { name?: string }): Promise<void> {
  // For display name, we use auth metadata since profiles does not have a name column.
  const { error } = await supabase.auth.updateUser({ data: { name: update.name } });
  if (error) throw new Error(error.message);
}
