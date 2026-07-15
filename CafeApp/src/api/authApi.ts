// src/api/authApi.ts
import { apiClient } from './client';
import { AuthResponse } from '../types';

export const login = async (email: string, motDePasse: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', { email, motDePasse });
  return response.data;
};

export const register = async (
  nom: string,
  email: string,
  motDePasse: string,
  telephone?: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', {
    nom,
    email,
    motDePasse,
    telephone,
  });
  return response.data;
};
