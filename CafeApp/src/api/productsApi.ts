// src/api/productsApi.ts
import { apiClient } from './client';
import { Product } from '../types';

export const fetchProducts = async (categorieId?: number): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>('/products', {
    params: categorieId ? { categorieId } : undefined,
  });
  return response.data;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export interface ProductPayload {
  nom: string;
  description: string;
  prix: number;
  image?: string;
  disponible?: boolean;
  categorieId: number;
}

export const createProduct = async (payload: ProductPayload): Promise<Product> => {
  const response = await apiClient.post<Product>('/products', payload);
  return response.data;
};

export const updateProduct = async (id: number, payload: ProductPayload): Promise<Product> => {
  const response = await apiClient.put<Product>(`/products/${id}`, payload);
  return response.data;
};

export const updateProductAvailability = async (id: number, disponible: boolean): Promise<Product> => {
  const response = await apiClient.patch<Product>(`/products/${id}/disponibilite`, { disponible });
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};
