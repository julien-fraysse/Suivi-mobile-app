/**
 * Users Mock Data
 * 
 * Données mockées pour les utilisateurs.
 * Stockage en mémoire simple pour le MVP.
 */

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
};

const delay = (ms: number = 100) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_USER: User = {
  id: '1',
  email: 'julien@suivi.app',
  firstName: 'Julien',
  lastName: 'Suivi',
  avatarUrl: undefined,
  role: 'admin',
};

export async function getUser(): Promise<User> {
  await delay();
  return { ...MOCK_USER };
}

export const mockUser = MOCK_USER;


