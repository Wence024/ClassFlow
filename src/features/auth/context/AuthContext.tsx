import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, AuthContextType } from "../types/auth";
import { loginApi, registerApi } from "../api/authApi";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Save user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    else localStorage.removeItem("authUser");
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await loginApi(email, password);
      setUser(user);
      localStorage.setItem("authToken", token);
    } catch (err: any) {
      setError(err.message || "Login failed");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await registerApi(name, email, password);
      setUser(user);
      localStorage.setItem("authToken", token);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
