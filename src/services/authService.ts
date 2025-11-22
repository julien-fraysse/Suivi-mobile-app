/**
 * Auth Service
 * 
 * Service API pour l'authentification (placeholder).
 * Utilise apiGet/apiPost pour les appels API réels (non utilisés pour l'instant).
 */

import { apiGet, apiPost } from './api';

// Placeholder functions - NOT USED YET
export async function fetchUser() {
  return apiGet('/me');
}

export async function login(email: string, password: string) {
  return apiPost('/auth/signin', { email, password });
}

export async function logout() {
  return apiPost('/auth/signout', {});
}

// Mock service functions
import { mockUser } from '../mocks/data/users';

export async function fetchUserMock() {
  return mockUser;
}

export async function loginMock(email: string, password: string) {
  // Mock implementation - not called yet
  return { token: `mock-token-${Date.now()}`, user: mockUser };
}

