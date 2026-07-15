// src/api/categoriesApi.ts
import { apiClient } from './client';
import { Category } from '../types';

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
};

export const createCategory = async (nom: string, ordreAffichage?: number): Promise<Category> => {
  const response = await apiClient.post<Category>('/categories', { nom, ordreAffichage });
  return response.data;
};

export const updateCategory = async (
  id: number,
  nom: string,
  ordreAffichage?: number
): Promise<Category> => {
  const response = await apiClient.put<Category>(`/categories/${id}`, { nom, ordreAffichage });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
