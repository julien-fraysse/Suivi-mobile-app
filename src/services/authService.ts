/**
 * Auth Service
 * 
 * Service API pour l'authentification avec sélection automatique mock/API.
 * Utilise API_MODE pour basculer entre les mocks et les endpoints réels.
 */

import { API_MODE } from '../config/apiMode';
import { apiGet, apiPost } from './api';
import { mockUser } from '../mocks/data/users';

export async function fetchUser() {
  if (API_MODE === 'mock') {
    return mockUser;
  }
  return apiGet('/me');
}

export async function login(email: string, password: string) {
  if (API_MODE === 'mock') {
    // Mock implementation
    return { token: `mock-token-${Date.now()}`, user: mockUser };
  }
  return apiPost('/auth/signin', { email, password });
}

export async function logout() {
  if (API_MODE === 'mock') {
    // Mock implementation - nothing to do
    return {};
  }
  return apiPost('/auth/signout', {});
}

