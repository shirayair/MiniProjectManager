// src/types/auth.ts

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  password: string;
  username: string;
}

export interface AuthResponse {
  token: string;
}
