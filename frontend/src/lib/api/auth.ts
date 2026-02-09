import type { User } from "@/lib/types";
import { apiFetch } from "./client";

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export async function loginWithGoogle(
  payload: { code?: string; id_token?: string }
): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
  }
  return data;
}

export async function getMe(): Promise<User> {
  return apiFetch<User>("/auth/me");
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
}
