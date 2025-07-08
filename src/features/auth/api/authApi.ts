/**
 * Simulated API for authentication. Replace with real API calls for production.
 */
import type { AuthResponse } from '../types/auth';

/**
 * Simulate a login API call.
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResponse if credentials are correct, otherwise throws error
 */
export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (email === 'test@example.com' && password === 'password') {
    return {
      user: { id: '1', name: 'Test User', email },
      token: 'fake-jwt-token',
    };
  }
  throw new Error('Invalid email or password');
}

/**
 * Simulate a registration API call.
 * @param name - User's name
 * @param email - User's email
 * @param password - User's password
 * @returns AuthResponse if registration is successful, otherwise throws error
 */
export async function registerApi(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (email && password && name) {
    return {
      user: { id: Date.now().toString(), name, email },
      token: 'fake-jwt-token',
    };
  }
  throw new Error('Registration failed');
}
