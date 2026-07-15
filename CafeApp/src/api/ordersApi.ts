// src/api/ordersApi.ts
import { apiClient } from './client';
import { Order, OrderStatus, PaymentMethod } from '../types';

export interface CreateOrderPayload {
  items: { produitId: number; quantite: number }[];
  modePaiement: PaymentMethod;
}

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const response = await apiClient.post<Order>('/orders', payload);
  return response.data;
};

export const fetchMyOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>('/orders/me');
  return response.data;
};

export const fetchOrderById = async (id: number): Promise<Order> => {
  const response = await apiClient.get<Order>(`/orders/${id}`);
  return response.data;
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>('/orders');
  return response.data;
};

export const fetchIncomingOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<Order[]>('/orders/entrantes');
  return response.data;
};

export const updateOrderStatus = async (id: number, statut: OrderStatus): Promise<Order> => {
  const response = await apiClient.patch<Order>(`/orders/${id}/statut`, { statut });
  return response.data;
};

export const validateOrderPayment = async (id: number): Promise<Order> => {
  const response = await apiClient.patch<Order>(`/orders/${id}/paiement`);
  return response.data;
};
