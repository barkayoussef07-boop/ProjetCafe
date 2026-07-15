// src/api/usersApi.ts
import { apiClient } from './client';
import { Role, User } from '../types';

export interface CreateUserPayload {
  nom: string;
  email: string;
  motDePasse: string;
  role: Role;
  telephone?: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const response = await apiClient.post<User>('/users', payload);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
