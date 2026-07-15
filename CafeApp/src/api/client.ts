// src/api/client.ts
import axios from 'axios';

// 10.0.2.2 = la machine hote (votre PC) vue depuis l'emulateur Android
// Sur un telephone physique : remplacer par l'IP locale du PC (ex: 192.168.1.10)
export const BASE_URL = 'http://10.0.2.2:8080/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Le token est garde en memoire et pousse ici par AuthContext (au demarrage et au login)
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Extrait un message d'erreur lisible depuis une reponse Axios/Spring
export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string; fieldErrors?: Record<string, string> } | undefined;
    if (data?.fieldErrors) {
      return Object.values(data.fieldErrors).join('\n');
    }
    if (data?.error) {
      return data.error;
    }
    if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
      return 'Impossible de contacter le serveur. Verifiez que le backend Spring Boot est demarre.';
    }
  }
  return 'Une erreur inattendue est survenue.';
}
