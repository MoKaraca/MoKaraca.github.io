import { AuthAdapter, AuthResponse, User } from "./auth-adapter";
import { api } from "../api";

export class JwtAuthAdapter implements AuthAdapter {
  async login(credentials: any): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, access_token } = response;
      
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return { user, token: access_token };
    } catch (error) {
      throw new Error("Invalid credentials or server error");
    }
  }

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  async getUser(): Promise<User | null> {
    if (typeof window === "undefined") return null;
    
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    
    try {
      // Validate token and get fresh user profile from backend
      const user = await api.get('/auth/me');
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch {
      this.logout();
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }
}

export const authAdapter = new JwtAuthAdapter();
