import { USE_MOCK_API } from '../config/environment';
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
  if (USE_MOCK_API) {
    return mockUsers.getUser();
  }

  const path = '/me';
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<User>(path, {}, _accessToken);
}


