import { loginApi, registerApi } from '../api/authApi';
import type { AuthResponse, User } from '../types/auth';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await loginApi(email, password);
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('authUser', JSON.stringify(response.user));
  return response;
}

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

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}

export function getStoredUser(): User | null {
  const stored = localStorage.getItem('authUser');
  return stored ? JSON.parse(stored) : null;
}
