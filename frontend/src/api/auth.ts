// src/api/auth.ts

import axiosInstance from '../utils/axiosInstance'; // ✅ Use the shared instance
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
  return response.data;
};
