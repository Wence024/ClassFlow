import type { AuthResponse } from "../types/auth";

export async function loginApi(
  email: string,
  password: string
): Promise<AuthResponse> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (email === "test@example.com" && password === "password") {
    return {
      user: { id: "1", name: "Test User", email },
      token: "fake-jwt-token",
    };
  }
  throw new Error("Invalid email or password");
}

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
      token: "fake-jwt-token",
    };
  }
  throw new Error("Registration failed");
}
