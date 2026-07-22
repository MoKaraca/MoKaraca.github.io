export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthAdapter {
  login(credentials: any): Promise<AuthResponse>;
  logout(): Promise<void>;
  getUser(): Promise<User | null>;
  refreshToken(): Promise<string | null>;
}
