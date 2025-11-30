import { API_MODE } from '../config/apiMode';
import { apiFetch } from './client';
import * as mockUsers from '../mocks/data/users';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
};

/**
 * Récupère l'utilisateur actuel
 */
export async function getUser(_accessToken?: string | null): Promise<User> {
  if (API_MODE === 'mock') {
    return mockUsers.getUser();
  }

  const path = '/me';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<User>(path, {}, _accessToken);
}


