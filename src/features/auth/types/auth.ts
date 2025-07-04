export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

export type AuthResponse = {
  user: User;
  token: string;
};
