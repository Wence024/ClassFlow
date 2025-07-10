/**
 * User object for authentication context.
 */
export type User = {
  id: string;
  name: string;
  email: string;
};

/**
 * AuthContextType defines the shape of the authentication context.
 */
export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resendVerificationEmail: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

/**
 * AuthResponse is returned by login/register API calls.
 */
export type AuthResponse = {
  user: User;
  token: string;
};
