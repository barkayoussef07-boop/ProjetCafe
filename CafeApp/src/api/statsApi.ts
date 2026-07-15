// src/api/statsApi.ts
import { apiClient } from './client';
import { DailyStats } from '../types';

export const fetchDailyStats = async (): Promise<DailyStats> => {
  const response = await apiClient.get<DailyStats>('/stats/daily');
  return response.data;
};
