/**
 * User object for authentication context.
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  program_id: string | null;
  department_id: string | null;
};

/**
 * AuthContextType defines the shape of the authentication context.
 */
export type AuthContextType = {
  user: User | null;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resendVerificationEmail: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};

/**
 * AuthResponse is returned by login/register API calls.
 */
export type AuthResponse = {
  user: User;
  token: string;
};
